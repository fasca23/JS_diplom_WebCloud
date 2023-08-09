/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
// 1. Конструктора, в котором выполняются следующие действия:
class SearchBlock {
  // 1. Сохраните переданный элемент в свойство объекта класса
  constructor( element ) {
    this.element = element;
    // 2. Вызовите метод `registerEvents` для подписки на события кликов по кнопкам "Заменить" и "Добавить"
    this.registerEvents();
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  // 2. Метод `registerEvents` добавляет обработчики событий кликов на кнопки "Заменить" и "Добавить"
  registerEvents(){
    // Кнопка "Заменить"
    const replace = this.element.querySelector('.replace');
    // Кнопка "Добавить"
    const add = this.element.querySelector('.add');
    // Поле ввода
    const input = this.element.getElementsByTagName('input')[0];
    
    replace.addEventListener('click', () => {
      // Получаем ввод удаляя все лишнее с концов
      const id = input.value.trim();
      if (id) {
        // Чистим картинки так как это замена
        App.imageViewer.clear();
        // забираем изображения get и запускаем отображение App
        VK.get(id, App.imageViewer.drawImages);
        // если ничего не вводить в поле будет просто очистка - хотел быстро проверить как работает 
      } else {
        App.imageViewer.clear();
      }
    });

    // Тоже но чистить не будем - это добавление
    add.addEventListener('click', () => {
      const id = input.value.trim();
      if (id) {
        VK.get(id, App.imageViewer.drawImages);
      }
    });
  }
}