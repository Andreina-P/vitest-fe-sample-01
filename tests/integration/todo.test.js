import { describe, it, expect, beforeEach } from 'vitest';
import {
  crearTareaElemento,
  agregarTarea,
  eliminarTarea,
  alternarTarea,
  limpiarCompletadas,
  actualizarContador,
  mostrarError,
} from '../../src/js/dom/todo.js';

// Helper: crea una lista <ul> fresca para cada prueba
function crearLista() {
  return document.createElement('ul');
}

// ============================================================
// Pruebas de integración — manipulación del DOM
// ============================================================
describe('crearTareaElemento', () => {
  it('debe crear un elemento <li> con la clase "tarea-item"', () => {
    const li = crearTareaElemento('Test');
    expect(li.tagName).toBe('LI');
    expect(li.classList.contains('tarea-item')).toBe(true);
  });
});

describe('agregarTarea', () => {
  let lista;

  beforeEach(() => {
    lista = crearLista();
  });

  it('debe agregar un <li> a la lista cuando el texto es válido', () => {
    const resultado = agregarTarea('Aprender vitest', lista);
    expect(resultado.exito).toBe(true);
    expect(lista.children.length).toBe(1);
    expect(lista.querySelector('.tarea-texto').textContent).toBe('Aprender vitest');
  });

  
  it('debe formatear el texto antes de agregar (primera mayus. siguiente minus.)', () => {
    agregarTarea(' esTuDiAr VerIFicAcIoN dE Sw', lista);
    const span = lista.querySelector('.tarea-texto');
    expect(span.textContent).toBe('Estudiar verificacion de sw');
  });

  // --- casos extras ---
  it('debe ser válido agregar una tarea con un texto de exactamente 200 caracteres', () => {
    const texto = 'A'.repeat(200);
    const resultado = agregarTarea(texto, lista);
    expect(resultado.exito).toBe(true);
    expect(lista.children.length).toBe(1);
  });
});

describe('eliminarTarea', () => {
  it('debe eliminar el elemento <li> del DOM', () => {
    const lista = crearLista();
    agregarTarea('Tarea a eliminar', lista);
    const li = lista.querySelector('.tarea-item');

    eliminarTarea(li);
    expect(lista.children.length).toBe(0);
  });

  // --- casos extras ---
  it('debe eliminar un elemento de la lista al hacer clic en el botón de eliminar', () => {
    const lista = crearLista();
    agregarTarea('Tarea a eliminar test', lista);
    const li = lista.querySelector('.tarea-item');
    const botonElim = li.querySelector('.btn-eliminar');

    botonElim.click();
    expect(lista.children.length).toBe(0);
  });
});

describe('alternarTarea', () => {
  it('debe agregar la clase "completada" cuando el checkbox está marcado', () => {
    const li = crearTareaElemento('Tarea test');
    const checkbox = li.querySelector('.tarea-checkbox');
    checkbox.checked = true;

    alternarTarea(li, checkbox);
    expect(li.classList.contains('completada')).toBe(true);
  });

  // --- casos extras ---
  it('debe alternar el evento change del checkbox cuando se hace clic en él', () => {
    const li = crearTareaElemento('Tarea test');
    const checkbox = li.querySelector('.tarea-checkbox');
    checkbox.checked = true;

    checkbox.dispatchEvent(new Event('change'));
    expect(li.classList.contains('completada')).toBe(true);
  });
});

describe('limpiarCompletadas', () => {
  it('debe eliminar solo las tareas completadas', () => {
    const lista = crearLista();
    agregarTarea('Tarea pendiente', lista);
    agregarTarea('Tarea completada', lista);

    // Marcar la segunda como completada
    const items = lista.querySelectorAll('.tarea-item');
    const checkbox = items[1].querySelector('.tarea-checkbox');
    checkbox.checked = true;
    alternarTarea(items[1], checkbox);

    const eliminadas = limpiarCompletadas(lista);
    expect(eliminadas).toBe(1);
    expect(lista.children.length).toBe(1);
    expect(lista.querySelector('.tarea-texto').textContent).toBe('Tarea pendiente');
  });

  // --- casos extras ---
  it('debe quedar vacía la lista cuando todas las tareas están completadas', () => {
    const lista = crearLista();
    agregarTarea('Tarea completada 1', lista);
    agregarTarea('Tarea completada 2', lista);

    // Marcar la dos como completadas
    const items = lista.querySelectorAll('.tarea-item');
    const checkbox1 = items[0].querySelector('.tarea-checkbox');
    const checkbox2 = items[1].querySelector('.tarea-checkbox');

    checkbox1.checked = true;
    checkbox2.checked = true;
    alternarTarea(items[0], checkbox1);
    alternarTarea(items[1], checkbox2);

    const eliminadas = limpiarCompletadas(lista);
    expect(eliminadas).toBe(2);
    expect(lista.children.length).toBe(0);
  });
});

describe('actualizarContador', () => {
  it('debe mostrar "0 tareas" cuando la lista está vacía', () => {
    const lista = crearLista();
    const contenedor = document.createElement('span');

    actualizarContador(lista, contenedor);
    expect(contenedor.textContent).toBe('0 tareas');
  });

  it('debe mostrar "1 tarea" cuando hay exactamente un elemento', () => {
    const lista = crearLista();
    agregarTarea('Única tarea', lista);
    const contenedor = document.createElement('span');

    actualizarContador(lista, contenedor);
    expect(contenedor.textContent).toBe('1 tarea');
  });

  
});

describe('mostrarError', () => {
  it('debe establecer el texto del contenedor con el mensaje de error', () => {
    const contenedor = document.createElement('div');
    mostrarError('Error de prueba', contenedor);
    expect(contenedor.textContent).toBe('Error de prueba');
  });

  
});
