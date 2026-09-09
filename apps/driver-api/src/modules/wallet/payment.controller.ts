import { Controller, Get, HttpCode, HttpStatus, Logger, Query } from '@nestjs/common';
import { WalletService } from '@libs/services/payment/src/wallet/wallet.service';

/**
 * REST controller to handle eSewa and Khalti payment callbacks.
 * Gateways redirect users to these URLs after payment processing.
 *
 * IMPORTANT: eSewa redirects via GET (not POST), while Khalti redirects via GET.
 * All callback endpoints use @Get with query parameters.
 */
@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly walletService: WalletService) {}

  // ── eSewa Callbacks ──────────────────────────────────────────────────
  //
  // eSewa redirects the user to the success/failure URL via GET with query params:
  //   ?transactionId=xxx&refId=yyy&oid=zzz (success)
  //   ?transactionId=xxx                  (failure)
  //

  @Get('esewa/success')
  @HttpCode(HttpStatus.OK)
  async esewaSuccess(
    @Query('transactionUuid') transactionId: string,
    @Query('refId') refId?: string,
    @Query('oid') oid?: string,
    @Query('data') data?: string,
  ): Promise<{ success: boolean; message: string; redirectUrl?: string }> {
    this.logger.log(`eSewa success callback: transactionId=${transactionId}, refId=${refId}, oid=${oid}`);

    if (!transactionId) {
      return { success: false, message: 'Missing transactionId', redirectUrl: this.esewaRedirect('failure') };
    }

    try {
      await this.walletService.completeTopupByUuid(transactionId, 0, { refId });
      return {
        success: true,
        message: 'Topup completed successfully',
        redirectUrl: this.esewaRedirect('success'),
      };
    } catch (error: any) {
      this.logger.error(`eSewa success callback error: ${error.message}`);
      try {
        await this.walletService.failTopup(transactionId, error.message);
      } catch (failError: any) {
        this.logger.error(`Failed to mark transaction as failed: ${failError.message}`);
      }
      return {
        success: false,
        message: error.message,
        redirectUrl: this.esewaRedirect('failure'),
      };
    }
  }

  @Get('esewa/failure')
  @HttpCode(HttpStatus.OK)
  async esewaFailure(
    @Query('transactionId') transactionId: string,
    @Query('remarks') remarks?: string,
  ): Promise<{ success: boolean; message: string; redirectUrl?: string }> {
    this.logger.log(`eSewa failure callback: transactionId=${transactionId}, remarks=${remarks}`);

    if (!transactionId) {
      return { success: false, message: 'Missing transactionId', redirectUrl: this.esewaRedirect('failure') };
    }

    try {
      await this.walletService.failTopup(transactionId, remarks || 'eSewa payment declined by user');
      return {
        success: true,
        message: 'Transaction marked as failed',
        redirectUrl: this.esewaRedirect('failure'),
      };
    } catch (error: any) {
      this.logger.error(`eSewa failure callback error: ${error.message}`);
      return {
        success: false,
        message: error.message,
        redirectUrl: this.esewaRedirect('failure'),
      };
    }
  }

  // ── Khalti Callbacks ─────────────────────────────────────────────────
  //
  // Khalti redirects the user to the return_url via GET with query params:
  //   ?pidx=xxx&status=Completed&transaction_id=yyy&total_amount=zzz (success)
  //   ?pidx=xxx&status=User+Cancelled                                   (failure)
  //

  @Get('khalti/success')
  @HttpCode(HttpStatus.OK)
  async khaltiSuccess(
    @Query('pidx') pidx: string,
    @Query('status') status: string,
    @Query('transaction_id') transactionId: string,
    @Query('total_amount') totalAmount?: string,
  ): Promise<{ success: boolean; message: string; redirectUrl?: string }> {
    this.logger.log(`Khalti success callback: pidx=${pidx}, status=${status}, transactionId=${transactionId}`);

    if (!pidx) {
      return { success: false, message: 'Missing pidx', redirectUrl: this.khaltiRedirect('failure') };
    }

    try {
      // Use pidx to look up / verify the transaction on Khalti's server
      const lookupResult = await this.walletService.completeTopupWithKhalti(pidx, transactionId);
      if (lookupResult.success) {
        return {
          success: true,
          message: 'Topup completed successfully',
          redirectUrl: this.khaltiRedirect('success'),
        };
      }
      return {
        success: false,
        message: lookupResult.message || 'Khalti verification failed',
        redirectUrl: this.khaltiRedirect('failure'),
      };
    } catch (error: any) {
      this.logger.error(`Khalti success callback error: ${error.message}`);
      return {
        success: false,
        message: error.message,
        redirectUrl: this.khaltiRedirect('failure'),
      };
    }
  }

  @Get('khalti/failure')
  @HttpCode(HttpStatus.OK)
  async khaltiFailure(
    @Query('pidx') pidx: string,
    @Query('status') status?: string,
    @Query('transaction_id') transactionId?: string,
  ): Promise<{ success: boolean; message: string; redirectUrl?: string }> {
    this.logger.log(`Khalti failure callback: pidx=${pidx}, status=${status}, transactionId=${transactionId}`);

    if (!pidx && !transactionId) {
      return { success: false, message: 'Missing pidx or transactionId', redirectUrl: this.khaltiRedirect('failure') };
    }

    const txnId = transactionId || pidx;
    try {
      await this.walletService.failTopup(txnId, `Khalti payment failed with status: ${status || 'unknown'}`);
      return {
        success: true,
        message: 'Transaction marked as failed',
        redirectUrl: this.khaltiRedirect('failure'),
      };
    } catch (error: any) {
      this.logger.error(`Khalti failure callback error: ${error.message}`);
      return {
        success: false,
        message: error.message,
        redirectUrl: this.khaltiRedirect('failure'),
      };
    }
  }

  private getRedirectUrl(gateway: 'esewa' | 'khalti', type: 'success' | 'failure'): string {
    const baseAPI = process.env.API_BASE_URL;
    return `${baseAPI}/payment/${gateway}/${type}`;
  }

  private esewaRedirect(type: 'success' | 'failure'): string {
    return this.getRedirectUrl('esewa', type);
  }

  private khaltiRedirect(type: 'success' | 'failure'): string {
    return this.getRedirectUrl('khalti', type);
  }
}