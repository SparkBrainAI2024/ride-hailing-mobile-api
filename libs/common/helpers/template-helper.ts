import { readFileSync } from 'fs';
import { compile } from 'handlebars';
import * as rootPath from 'path';

export const generateEmailTemplate = (content: string, data: Record<string, any> = {}) => {
  const filePath = rootPath.join(__dirname, `../../../views/templates/email-template.hbs`);
  const emailTemplate = readFileSync(filePath, 'utf8');
  const template = compile(emailTemplate);

  // Pass all data including logoUrl, name, link, etc. to the template
  const html = template({
    body: content,
    ...data, // This spreads all the data including logoUrl, name, link
  });

  return html;
};

export function replacePlaceholders(
  htmlTemplate: string,
  data: Record<string, any> = {},
  usedKeys: Record<string, boolean> = {},
) {
  return htmlTemplate.replace(/\{\{\{?(\w+)\}?\}\}/g, (match, key) => {
    // Only handle "name" with special logic
    if (key === 'name') {
      if (!usedKeys[key]) {
        usedKeys[key] = true;
        return data[key] || '';
      } else {
        // Remove duplicates by replacing with empty string
        return '';
      }
    }

    // Default behavior for other placeholders
    const value = data[key];
    return value || '';
  });
}
