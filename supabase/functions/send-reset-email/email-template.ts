export function buildEmailHtml(nombre: string, resetLink: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Recupera tu contraseña</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f7f6;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f7f6;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          <!-- Header teal -->
          <tr>
            <td style="background:linear-gradient(135deg,#3BA99F,#008585);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">
                Clínica X
              </h1>
              <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.85);">
                Recuperación de contraseña
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 16px;font-size:16px;color:#1a1a2e;font-weight:500;">
                Hola, ${nombre}
              </p>
              <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#4a5568;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta.
                Haz clic en el botón de abajo para crear una nueva contraseña.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 24px;">
                    <a href="${resetLink}"
                       style="display:inline-block;background:#3BA99F;color:#ffffff;font-size:15px;font-weight:600;padding:14px 40px;border-radius:999px;text-decoration:none;box-shadow:0 4px 12px rgba(59,169,159,0.3);">
                      Restablecer contraseña
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 16px;font-size:13px;line-height:1.5;color:#718096;">
                Si no solicitaste este cambio, puedes ignorar este correo.
                El enlace expirará en <strong>1 hora</strong>.
              </p>
              <p style="margin:0;font-size:13px;line-height:1.5;color:#718096;word-break:break-all;">
                Si el botón no funciona, copia y pega este enlace en tu navegador:<br/>
                <a href="${resetLink}" style="color:#3BA99F;">${resetLink}</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background-color:#f8faf9;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#a0aec0;">
                Clínica X &copy; ${new Date().getFullYear()} &mdash; Todos los derechos reservados
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
