import { APP_URL, BRAND_ACCENT, BRAND_NAME, BRAND_PRIMARY, BRAND_SECONDARY, EMAIL_FOOTER_NOTE } from '@/lib/email-utils/email-config';

export interface BaseEmailTemplateOptions {
  title: string;
  preheader: string;
  body: string;
  ctaUrl?: string;
  ctaLabel?: string;
  secondaryCtaUrl?: string;
  secondaryCtaLabel?: string;
}

export function renderBaseEmailLayout({
  title,
  preheader,
  body,
  ctaUrl,
  ctaLabel,
  secondaryCtaUrl,
  secondaryCtaLabel,
}: BaseEmailTemplateOptions): string {
  const ctaMarkup = ctaUrl && ctaLabel
    ? `<tr><td align="center" style="padding: 0 32px 24px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;"><tr><td align="center" bgcolor="${BRAND_PRIMARY}" style="border-radius: 999px; padding: 0;"><a href="${ctaUrl}" style="display: inline-block; padding: 14px 28px; font-size: 15px; line-height: 18px; font-weight: 700; color: #FFFFFF; text-decoration: none; font-family: Arial, sans-serif;">${ctaLabel}</a></td></tr></table></td></tr>`
    : '';

  const secondaryMarkup = secondaryCtaUrl && secondaryCtaLabel
    ? `<tr><td align="center" style="padding: 0 32px 24px;"><a href="${secondaryCtaUrl}" style="color: ${BRAND_PRIMARY}; font-size: 14px; font-weight: 700; text-decoration: underline; font-family: Arial, sans-serif;">${secondaryCtaLabel}</a></td></tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>${title}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: Arial, Helvetica, sans-serif; color: ${BRAND_SECONDARY};">
    <div style="display:none; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all;">${preheader}</div>
    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0" style="background: #f3f4f6; width: 100%; margin: 0; padding: 32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0" style="max-width: 640px; width: 100%; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 18px; overflow: hidden;">
            <tr>
              <td style="padding: 28px 32px 16px; background: linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%); border-bottom: 1px solid #ece7ff;">
                <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0">
                  <tr>
                    <td align="left" style="font-size: 24px; line-height: 32px; font-weight: 800; letter-spacing: -0.03em; color: ${BRAND_PRIMARY}; font-family: Arial, Helvetica, sans-serif;">
                      ${BRAND_NAME}
                    </td>
                    <td align="right" style="font-size: 11px; line-height: 16px; letter-spacing: 0.12em; color: #6b7280; text-transform: uppercase; font-family: Arial, Helvetica, sans-serif;">
                      smart commerce
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px 32px 8px; font-family: Arial, Helvetica, sans-serif;">
                <div style="font-size: 28px; line-height: 36px; font-weight: 800; letter-spacing: -0.04em; color: ${BRAND_SECONDARY};">${title}</div>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 32px 20px; font-family: Arial, Helvetica, sans-serif;">
                <div style="font-size: 15px; line-height: 24px; color: #4b5563;">${body}</div>
              </td>
            </tr>
            ${ctaMarkup}
            ${secondaryMarkup}
            <tr>
              <td style="padding: 0 32px 28px;">
                <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0" style="background: #faf7ff; border: 1px solid #ede9fe; border-radius: 12px;">
                  <tr>
                    <td style="padding: 18px 20px; font-size: 13px; line-height: 22px; color: #4b5563; font-family: Arial, Helvetica, sans-serif;">
                      Need help? Reach us at <a href="mailto:support@koomboapp.com" style="color: ${BRAND_PRIMARY}; text-decoration: none; font-weight: 700;">support@koomboapp.com</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 32px 32px; font-family: Arial, Helvetica, sans-serif;">
                <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0">
                  <tr>
                    <td align="center" style="padding-top: 12px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; line-height: 18px;">
                      ${BRAND_NAME} • ${APP_URL}<br />
                      ${EMAIL_FOOTER_NOTE}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
