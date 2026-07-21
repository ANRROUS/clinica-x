export interface ManualStep {
  text: string;
  image?: string;
}

export interface ManualSection {
  id: string;
  title: string;
  description?: string;
  steps: ManualStep[];
  note?: string;
}

export interface ManualRole {
  role: string;
  sections: ManualSection[];
}

export const manualData: Record<string, ManualRole> = {
  paciente_guest: {
    role: 'PACIENTE',
    sections: [
      {
        id: 'p-login',
        title: 'Inicio de Sesión',
        description:
          'Para acceder al portal de paciente, debes contar con un usuario y contraseña registrados previamente.',
        steps: [
          {
            text: 'Ingresa a la página principal de Clínica X y haz clic en el botón "Ingresar" ubicado en la parte superior derecha.',
          },
          {
            text: 'Completa los campos de "Usuario" y "Contraseña" con las credenciales que te fueron asignadas al registrarte.',
          },
          {
            text: 'Haz clic en el botón "Iniciar Sesión". Si los datos son correctos, serás redirigido al portal de paciente.',
          },
          {
            text: 'En caso de haber olvidado tu contraseña, haz clic en "¿Olvidaste tu contraseña?" para restablecerla mediante tu correo electrónico.',
          },
        ],
      },
      {
        id: 'p-registro',
        title: 'Registro de Paciente',
        description:
          'Si aún no tienes una cuenta, puedes registrarte en la plataforma siguiendo estos pasos:',
        steps: [
          {
            text: 'En la página principal, haz clic en el botón "Registrarse" ubicado en la parte superior derecha.',
          },
          {
            text: 'Completa el formulario con tus datos personales: nombre, apellido, DNI, correo electrónico, teléfono, usuario y contraseña.',
          },
          {
            text: 'Asegúrate de que todos los datos sean correctos y haz clic en "Registrarse".',
          },
          {
            text: 'Una vez registrado, recibirás una confirmación y podrás iniciar sesión con tus nuevas credenciales.',
          },
        ],
      },
    ],
  },

  paciente: {
    role: 'PACIENTE',
    sections: [
      {
        id: 'p61',
        title: 'Reserva de Cita — Modalidad Manual',
        description:
          'Esta modalidad permite al paciente elegir la especialidad, el médico, el día y la hora de su preferencia.',
        steps: [
          {
            text: 'Una vez iniciada la sesión, dirígete a la sección "Reservar cita", ubicada en la parte superior de la pantalla.',
            image: '/manual/manual-01.png',
          },
          {
            text: 'En la página de reserva de citas, selecciona la especialidad en el panel izquierdo. Actualmente, "Medicina General" es la única especialidad disponible.',
            image: '/manual/manual-02.png',
          },
          {
            text: 'Después de elegir la especialidad, se mostrará la lista de especialistas disponibles. Selecciona al médico de tu preferencia.',
            image: '/manual/manual-03.png',
          },
          {
            text: 'A continuación, se mostrarán los días disponibles del especialista. Selecciona el día que prefieras.',
            image: '/manual/manual-04.png',
          },
          {
            text: 'Luego se mostrarán las opciones de horario disponibles. Elige el horario según tu disponibilidad.',
            image: '/manual/manual-05.png',
          },
          {
            text: 'Finalmente, haz clic en el botón "Confirmar Reserva". Se mostrará un modal con los datos de la cita para que puedas confirmarla.',
            image: '/manual/manual-06.png',
          },
          {
            text: 'Al hacer clic en "Aceptar", tu reserva quedará generada y se mostrará un toast de confirmación.',
            image: '/manual/manual-07.png',
          },
          {
            text: 'Serás redirigido automáticamente a "Mi perfil", ubicada en la parte superior. Selecciona "Reservas", en el panel izquierdo, para visualizar tu reserva activa.',
            image: '/manual/manual-08.png',
          },
          {
            text: 'De forma adicional, puedes consultar tus reservas anteriores haciendo clic en el botón "Pasadas", dentro de la misma sección.',
            image: '/manual/manual-09.png',
          },
        ],
      },
      {
        id: 'p62',
        title: 'Reserva de Cita — Modalidad Automática',
        description:
          'Si deseas realizar una reserva de forma rápida, sin necesidad de especificar especialista, día u hora, el sistema ofrece la opción de "reserva automática". Al hacer clic en el botón correspondiente, la reserva se genera en segundos.',
        steps: [
          {
            text: 'Luego de iniciar sesión, dirígete a "Reservar cita", ubicada en la parte superior.',
            image: '/manual/manual-10.png',
          },
          {
            text: 'En la página "Reservar cita", elige la especialidad (por ejemplo, Medicina General).',
            image: '/manual/manual-11.png',
          },
          {
            text: 'Una vez seleccionada la especialidad, se mostrará un botón azul en la parte superior derecha con el texto "Automático". Haz clic en él para generar tu reserva.',
            image: '/manual/manual-12.png',
          },
          {
            text: 'Se mostrará un mensaje temporal (toast) confirmando que la reserva se realizó con éxito.',
            image: '/manual/manual-13.png',
          },
          {
            text: 'Serás redirigido automáticamente a "Mi perfil", ubicada en la parte superior. Haz clic en "Reservas" para visualizarla.',
            image: '/manual/manual-14.png',
          },
        ],
      },
      {
        id: 'p63',
        title: 'Consulta de Historial, Tratamiento y Carga de Análisis en PDF',
        description:
          'En esta sección podrás revisar el historial de tus consultas, visualizar tu tratamiento vigente y subir los resultados de tus análisis médicos.',
        steps: [
          {
            text: 'Para consultar el historial de tus consultas médicas, dirígete a "Mi perfil" y selecciona el botón "Consultas". Podrás identificar cada consulta según la fecha y el médico correspondiente. Si tu historial es extenso, puedes buscar por fecha exacta en la parte superior de la lista.',
            image: '/manual/manual-15.png',
          },
          {
            text: 'Para consultar tu tratamiento, en la misma sección "Mi perfil", selecciona el botón "Tratamiento". Allí podrás visualizar tu medicación (receta) vigente y los análisis solicitados por el médico.',
            image: '/manual/manual-16.png',
          },
          {
            text: 'Para subir el resultado de un análisis (por ejemplo, análisis de sangre) en formato PDF, haz clic en el botón "Subir PDF" y selecciona el archivo correspondiente. Espera a que finalice la carga; el sistema mostrará una animación durante el proceso.',
            image: '/manual/manual-17.png',
          },
          {
            text: 'Una vez finalizada la carga, se mostrará un mensaje de confirmación (toast).',
            image: '/manual/manual-18.png',
          },
        ],
      },
      {
        id: 'p64',
        title: 'Cancelación de una Reserva',
        description:
          'Si necesitas cancelar una cita que ya tienes agendada, puedes hacerlo desde la sección de reservas en tu perfil.',
        steps: [
          {
            text: 'Para cancelar una reserva, dirígete a "Mi perfil" y selecciona el botón "Reservas" para visualizar tus reservas activas.',
            image: '/manual/manual-19.png',
          },
          {
            text: 'Selecciona la reserva que deseas cancelar y haz clic en el botón "Cancelar". Se mostrará un modal para confirmar la cancelación.',
            image: '/manual/manual-20.png',
          },
          {
            text: 'Haz clic en "Sí, cancelar". Se mostrará un toast confirmando la acción realizada.',
            image: '/manual/manual-21.png',
          },
        ],
      },
      {
        id: 'p65',
        title: 'Reprogramación de una Reserva',
        description:
          'Si necesitas cambiar la fecha u hora de una cita ya agendada, puedes reprogramarla desde tu perfil.',
        steps: [
          {
            text: 'Para reprogramar una reserva, dirígete a "Mi perfil" y selecciona el botón "Reservas" para visualizar tus reservas activas.',
            image: '/manual/manual-22.png',
          },
          {
            text: 'Selecciona la reserva que deseas reprogramar y haz clic en el botón "Reprogramar". Se mostrará un modal para elegir la nueva fecha.',
            image: '/manual/manual-23.png',
          },
          {
            text: 'Una vez seleccionada la nueva fecha, se mostrarán los horarios disponibles para ese día, de haberlos.',
            image: '/manual/manual-24.png',
          },
          {
            text: 'Elige el horario que se ajuste a tu disponibilidad y haz clic en "Confirmar". Se mostrará un toast confirmando la acción realizada.',
            image: '/manual/manual-25.png',
          },
        ],
      },
    ],
  },

  medico: {
    role: 'MEDICO',
    sections: [
      {
        id: 'm71',
        title: 'Registro de Consulta: Diagnóstico, Análisis y Medicamentos',
        description:
          'En esta sección se describe el proceso que sigue el médico para atender una consulta: revisión del calendario, registro del diagnóstico, solicitud de análisis clínicos y prescripción de medicamentos.',
        steps: [
          {
            text: 'Inicia sesión con las credenciales de médico asignadas. Dentro del portal, revisa el calendario para verificar si tienes una cita agendada. Si estás navegando por otras secciones, selecciona nuevamente "Calendario", en la parte superior, para volver.',
            image: '/manual/manual-26.png',
          },
          {
            text: 'Al llegar la hora de la cita, haz clic en ella dentro del calendario para ser redirigido a la sección "Pacientes", o accede manualmente a dicha sección desde la parte superior.',
            image: '/manual/manual-27.png',
          },
          {
            text: 'En la parte superior izquierda se mostrará el paciente actual, es decir, aquel con cita agendada para esa hora. Haz clic en el botón "Iniciar Consulta".',
            image: '/manual/manual-28.png',
          },
          {
            text: 'Ingresa el diagnóstico del paciente en el campo de texto correspondiente.',
            image: '/manual/manual-29.png',
          },
          {
            text: 'En la sección "Análisis Clínico", registra los análisis que se solicitan para el paciente. Haz clic en el botón "+ Agregar" y selecciona el análisis correspondiente en el menú desplegable (por ejemplo, Análisis de Sangre).',
            image: '/manual/manual-30.png',
          },
          {
            text: 'Haz clic en el botón "Agregar", ubicado junto al nombre del análisis, para confirmar su registro.',
            image: '/manual/manual-31.png',
          },
          {
            text: 'Finalmente, agrega los medicamentos requeridos según el catálogo disponible. Haz clic en "+ Agregar", selecciona el medicamento en el menú desplegable (por ejemplo, Paracetamol) e indica la duración, en días, y la frecuencia de administración.',
            image: '/manual/manual-32.png',
          },
          {
            text: 'Haz clic en el botón "Agregar", ubicado en la misma fila del nombre, la duración y la frecuencia, para registrar el medicamento.',
            image: '/manual/manual-33.png',
          },
          {
            text: 'Repite el proceso con todos los medicamentos que sean necesarios.',
            image: '/manual/manual-34.png',
          },
          {
            text: 'Una vez verificada la información registrada en diagnóstico, análisis clínico y medicamentos, haz clic en "Finalizar Consulta".',
            image: '/manual/manual-35.png',
          },
          {
            text: 'Se mostrará un modal de confirmación para finalizar la consulta.',
            image: '/manual/manual-36.png',
          },
          {
            text: 'También puedes acceder al apartado "Historial", ubicado junto a "Consulta Actual", para utilizar el Agente X y consultar de forma más ágil los registros anteriores del paciente.',
            image: '/manual/manual-37.png',
          },
        ],
        note: 'Los pacientes que no se encuentren en el apartado "Actual" no permiten el uso del Agente X (asistente virtual con IA) ni el inicio de consulta.',
      },
    ],
  },

  admin: {
    role: 'ADMIN',
    sections: [
      {
        id: 'a81',
        title: 'Registro de un Nuevo Médico',
        description:
          'En esta sección se describe el proceso para registrar un nuevo médico en el sistema, incluyendo sus datos personales y horarios de atención.',
        steps: [
          {
            text: 'Inicia sesión con las credenciales de administrador. Dentro del portal, haz clic en el botón "Agregar +" o accede a la sección "Nuevo Doctor" desde la parte superior.',
            image: '/manual/manual-38.png',
          },
          {
            text: 'En el panel izquierdo, ingresa los datos personales del médico: nombre, DNI, correo electrónico, teléfono, contraseña, usuario y especialidad.',
            image: '/manual/manual-39.png',
          },
          {
            text: 'En el panel derecho, configura los horarios de atención del médico para la semana actual (el registro de horarios se reinicia semanalmente). Selecciona el turno "Mañana" o "Tarde" mediante los botones de la parte superior derecha y haz clic en los bloques de horario disponibles; cada clic activa un bloque de color en el calendario.',
            image: '/manual/manual-40.png',
          },
          {
            text: 'Una vez completados los datos y el horario del médico, haz clic en "Guardar Cambios".',
            image: '/manual/manual-41.png',
          },
          {
            text: 'Se mostrará un mensaje de confirmación (toast) y el nuevo médico quedará visible en el panel principal (dashboard).',
            image: '/manual/manual-42.png',
          },
        ],
      },
      {
        id: 'a82',
        title: 'Edición de Datos de un Médico',
        description:
          'Esta sección explica cómo modificar los datos de un médico ya registrado, incluyendo sus datos personales, turnos y horarios de atención.',
        steps: [
          {
            text: 'Para editar los datos de un médico, haz clic en el ícono de lápiz correspondiente dentro del panel principal (dashboard).',
          },
          {
            text: 'Podrás modificar los datos del médico; por ejemplo, cambiar la contraseña por motivos de seguridad o actualizar su información.',
            image: '/manual/manual-43.png',
          },
          {
            text: 'También es posible modificar el turno y el horario del médico. Para deshabilitar un bloque de horario, haz clic nuevamente sobre él.',
            image: '/manual/manual-44.png',
          },
          {
            text: 'Una vez actualizados correctamente los datos, haz clic en "Guardar cambios".',
            image: '/manual/manual-45.png',
          },
          {
            text: 'Se mostrará un mensaje de confirmación (toast); si modificaste el turno o el horario, el cambio también será visible en el panel principal (dashboard).',
            image: '/manual/manual-46.png',
          },
          {
            text: 'Además, puedes inactivar a un médico haciendo clic en el interruptor (toggle) correspondiente. Se mostrará un modal de confirmación.',
            image: '/manual/manual-47.png',
          },
          {
            text: 'Una vez confirmada la acción, el médico se mostrará como inactivo en el panel principal.',
            image: '/manual/manual-48.png',
          },
        ],
      },
    ],
  },
};
