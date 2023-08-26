/**
 * Класс BaseModal
 * Используется как базовый класс всплывающего окна
 */
class BaseModal {
  constructor( element ) {
    this.semantic = element;
    this.dom = element[0];
  }

  /**
   * Открывает всплывающее окно
   */
  open() {
    this.semantic.modal('show');
  }

  /**
   * Закрывает всплывающее окно
   */
  close() {
    this.semantic.modal('hide');
  }
}