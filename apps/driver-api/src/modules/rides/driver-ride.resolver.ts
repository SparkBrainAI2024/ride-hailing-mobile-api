import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@libs/guards';
import { CurrentUser, Roles } from '@libs/common';
import { User, roles, BasicResponse, DriverRideResponse, Rides } from '@libs/data-access';
import { DriverRideAcceptanceService } from './driver-ride-acceptance.service';
import { RoleGuard } from '@libs/guards/role.guard';
import { EnvService } from '@libs/common/config/env.service';
import axios from 'axios';

@Resolver()
@UseGuards(AuthGuard, RoleGuard)
export class DriverRideResolver {
  private readonly logger = new Logger(DriverRideResolver.name);

  constructor(
    private readonly driverRideAcceptanceService: DriverRideAcceptanceService,
    private readonly envService: EnvService,
  ) { }

  /**
   * Shared helper to forward a driver ride mutation to the matchmaking service.
   * Returns { success, message } without duplicating axios plumbing per mutation.
   */
  private async callMatchmakingMutation<T extends { success?: boolean; message?: string }>(
    operationName: string,
    mutation: string,
    variables: Record<string, string>,
    fallbackMessage: string,
  ): Promise<BasicResponse> {
    const matchmakingUrl = this.envService.getString('RIDE_MATCHMAKING_URL', 'http://localhost:3004');
    try {
      const response = await axios.post(`${matchmakingUrl}/graphql`, {
        query: mutation,
        variables,
      });
      const result = response.data?.data?.[operationName];
      return {
        success: result?.success || false,
        message: result?.message || fallbackMessage,
      };
    } catch (err: any) {
      this.logger.error(`Failed to ${operationName} via matchmaking service: ${err?.message || err}`);
      return { success: false, message: fallbackMessage };
    }
  }

  @Roles(roles.RIDER)
  @Mutation(() => DriverRideResponse, {
    name: 'acceptRide',
    description: 'Driver accepts a ride request (RIDER role only). Returns full ride details with driver/vehicle/passenger info.',
  })
  async acceptRide(
    @CurrentUser() user: User,
    @Args('rideId') rideId: string,
  ): Promise<DriverRideResponse> {
    const result = await this.driverRideAcceptanceService.acceptRide(rideId, user._id.toString());
    return {
      success: result.success,
      message: result.message,
      data: result.data ? {
        rideId: result.data.rideId,
        rideUUId: result.data.rideUUId,
        pickupLocation: { address: result.data.pickupLocation?.address, coordinates: result.data.pickupLocation?.coordinates, city: result.data.pickupLocation?.city },
        dropoffLocation: result.data.dropoffLocation ? { address: result.data.dropoffLocation.address, coordinates: result.data.dropoffLocation.coordinates, city: result.data.dropoffLocation.city } : null,
        distanceInKm: result.data.distanceInKm,
        estimatedFare: result.data.estimatedFare,
        estimatedTimeInMinutes: result.data.estimatedTimeInMinutes,
        driver: { driverId: result.data.driver.driverId, fullName: result.data.driver.fullName, phone: result.data.driver.phone, profileImage: result.data.driver.profileImage, rating: result.data.driver.rating },
        passenger: { passengerId: result.data.passenger.passengerId, fullName: result.data.passenger.fullName, phone: result.data.passenger.phone },
        vehicle: { vehicleId: result.data.vehicle.vehicleId, vehicleModel: result.data.vehicle.vehicleModel, vehicleType: result.data.vehicle.vehicleType, color: result.data.vehicle.color, numberPlate: result.data.vehicle.numberPlate, year: result.data.vehicle.year },
        acceptedAt: result.data.acceptedAt,
      } : null,
    };
  }

  private static readonly START_RIDE_MUTATION = `
    mutation StartRide($rideId: String!, $driverId: String!) {
      startRide(rideId: $rideId, driverId: $driverId) {
        success
        message
      }
    }
  `;

  private static readonly PICKUP_PASSENGER_MUTATION = `
    mutation PickupPassenger($rideId: String!, $driverId: String!) {
      pickupPassenger(rideId: $rideId, driverId: $driverId) {
        success
        message
      }
    }
  `;

  @Roles(roles.RIDER)
  @Mutation(() => BasicResponse, {
    name: 'startRide',
    description: 'Driver starts ride - sets status to PICKUP, records rideStartedAt',
  })
  async startRide(
    @CurrentUser() user: User,
    @Args('rideId') rideId: string,
  ): Promise<BasicResponse> {
    this.logger.log(`GraphQL: Driver ${user._id} starting ride ${rideId}`);
    return this.callMatchmakingMutation(
      'startRide',
      DriverRideResolver.START_RIDE_MUTATION,
      { rideId, driverId: user._id.toString() },
      'Failed to start ride',
    );
  }

  @Roles(roles.RIDER)
  @Mutation(() => BasicResponse, {
    name: 'pickupPassenger',
    description: 'Driver picked up passenger - sets status to ONGOING, updates destination distance',
  })
  async pickupPassenger(
    @CurrentUser() user: User,
    @Args('rideId') rideId: string,
  ): Promise<BasicResponse> {
    this.logger.log(`GraphQL: Driver ${user._id} picked up passenger for ride ${rideId}`);
    return this.callMatchmakingMutation(
      'pickupPassenger',
      DriverRideResolver.PICKUP_PASSENGER_MUTATION,
      { rideId, driverId: user._id.toString() },
      'Failed to pickup passenger',
    );
  }


  @Roles(roles.RIDER)
  @Mutation(() => Rides, {
    name: 'completeRide',
    description: 'Complete a ride - sets status to ONGOING but add to rideEndedAt date, publishes ride-completed Ably event with fare breakdown',
  })
  async completeRide(
    @CurrentUser() user: User,
    @Args('rideId') rideId: string,

  ): Promise<Rides> {
    this.logger.log(`GraphQL: Driver ${user._id} completing ride ${rideId}`);
    return this.driverRideAcceptanceService.completeRide({ rideId }, user._id.toString())

  }

  private static readonly START_SCHEDULED_RIDE_MUTATION = `
    mutation StartScheduledRide($rideId: String!, $driverId: String!) {
      startScheduledRide(rideId: $rideId, driverId: $driverId) {
        success
        message
      }
    }
  `;

  private static readonly END_SCHEDULED_RIDE_MUTATION = `
    mutation EndScheduledRide($rideId: String!, $driverId: String!) {
      endScheduledRide(rideId: $rideId, driverId: $driverId) {
        success
        message
      }
    }
  `;

  @Roles(roles.RIDER)
  @Mutation(() => BasicResponse, {
    name: 'startScheduledRide',
    description: 'Driver starts a SCHEDULED (booking) ride - passenger onboard, sets status to ONGOING, records rideStartedAt and notifies the passenger',
  })
  async startScheduledRide(
    @CurrentUser() user: User,
    @Args('rideId') rideId: string,
  ): Promise<BasicResponse> {
    this.logger.log(`GraphQL: Driver ${user._id} starting scheduled ride ${rideId}`);
    return this.callMatchmakingMutation(
      'startScheduledRide',
      DriverRideResolver.START_SCHEDULED_RIDE_MUTATION,
      { rideId, driverId: user._id.toString() },
      'Failed to start scheduled ride',
    );
  }

  @Roles(roles.RIDER)
  @Mutation(() => BasicResponse, {
    name: 'endScheduledRide',
    description: 'Driver ends a SCHEDULED ride - passenger dropped off, records rideEndedAt (status stays ONGOING until completed) and notifies the passenger',
  })
  async endScheduledRide(
    @CurrentUser() user: User,
    @Args('rideId') rideId: string,
  ): Promise<BasicResponse> {
    this.logger.log(`GraphQL: Driver ${user._id} ending scheduled ride ${rideId}`);
    return this.callMatchmakingMutation(
      'endScheduledRide',
      DriverRideResolver.END_SCHEDULED_RIDE_MUTATION,
      { rideId, driverId: user._id.toString() },
      'Failed to end scheduled ride',
    );
  }

  @Roles(roles.RIDER)
  @Mutation(() => Rides, {
    name: 'completeScheduledRide',
    description: 'Complete a SCHEDULED ride - finalizes the booking fare, sets status to COMPLETED, publishes ride-completed Ably event with fare breakdown',
  })
  async completeScheduledRide(
    @CurrentUser() user: User,
    @Args('rideId') rideId: string,
  ): Promise<Rides> {
    this.logger.log(`GraphQL: Driver ${user._id} completing scheduled ride ${rideId}`);
    return this.driverRideAcceptanceService.completeScheduledRide({ rideId }, user._id.toString());
  }

  @Roles(roles.RIDER)
  @Mutation(() => BasicResponse, {
    name: 'rejectRide',
    description: 'Driver rejects a ride request (RIDER role only)',
  })
  async rejectRide(
    @CurrentUser() user: User,
    @Args('rideId') rideId: string,
  ): Promise<BasicResponse> {
    this.logger.log(`GraphQL: Driver ${user._id} rejecting ride ${rideId}`);
    const result = await this.driverRideAcceptanceService.rejectRide(rideId, user._id.toString());
    return {
      success: result.success,
      message: result.message,
    };
  }
}
