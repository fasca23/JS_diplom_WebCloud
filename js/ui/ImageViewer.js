/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor( element ) {
    // Полученный DOM элемент сохранить в свойство объекта класса.
    this.element = element;
    // Ищем блок изображений
    // 2. Для дальнейшего взаимодействия можно так же сохранить блок предпросмотра изображения.
    this.imagesList = element.querySelector('.images-list .grid .row');
    // 3. Так же для дальнейшего взаимодействия, можно сохранить блок, в котором будут отрисовываться все изображения.
    this.imagePreview = element.getElementsByTagName('img')[0];
    
    this.drawImages = this.drawImages.bind(this);
    // 4. Вызовите метод добавления обработчиков событий (`registerEvents`).
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents(){
    // 1. Так как мы изначально не знаем сколько элементов изображений будет отображаться в блоке, то добавим 
    // обработчик события двойного клика на весь блок (который сохраняли в пункте 1.3). А внутри обработчка клика будем конкретно проверять, 
    // был ли клик на изображении. Если двойной клик был на изображении. то это изображение необходимо отобразить в области предпросмотра 
    // (элемент, который сохраняли в п.п. 1.2)
    let that = this;
    this.imagesList.addEventListener('dblclick', (e) => {
      if (e.target.tagName == 'IMG') {
        that.imagePreview.src = e.target.src;
      }
    });
    // Если картинка выделена - повторное нажатие снимает рамку и наоборот
    this.imagesList.addEventListener('click', (e) => {
      if (e.target.tagName == 'IMG') {
        e.target.classList.toggle('selected');
        // Также запускаем функцию работы нижних кнопок
        that.checkButtonText();
      }
    });
    // Кнопка "Выбрать все"....
    document.querySelector('.select-all').addEventListener('click', () => {
      const images = this.imagesList.getElementsByTagName('img');
      let check = 0;
      // Проверка наличия обводки - считаем на скольких картинках
      for (let img of images) {
        if (img.classList.contains('selected')) {
          check += 1;
        }
      }
      // Если есть обводка на всех картинках - удаляем кликом
      if (check === images.length) {
        for (let img of images) {
          img.classList.remove('selected');
        }
      // Если нет - добавляем кликом
      } else {
        for (let img of images) {
          if (!img.classList.contains('selected')) {
            img.classList.add('selected');
          }
        }
      }
      // Также запускаем функцию работы нижних кнопок
      this.checkButtonText();
    });
    // Кнопка "Посмотреть загруженные файлы"
    document.querySelector('.show-uploaded-files').addEventListener('click', () => {
      const previewer = App.getModal('filePreviewer');
      previewer.open();
      const i = document.querySelector('.asterisk.loading.icon.massive');
      const images = Yandex.getUploadedFiles(previewer.showImages);
    });

    document.querySelector('.send').addEventListener('click', () => {
      const uploader = App.getModal('fileUploader');
      const selected = Array.from(this.imagesList.getElementsByClassName('selected'));
      uploader.open();
      uploader.showImages(selected);
    });
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    // Пока существуют потомки - будем их удалять
    while (this.imagesList.firstChild) {
      this.imagesList.removeChild(this.imagesList.firstChild);
    }
  }

  /**
   * Отрисовывает изображения.
  */
  
  drawImages(images) {
    // активируем только если есть картинки
    if (images) {
      document.querySelector('.select-all').classList.remove('disabled');
      for (let el of images) {
        // Создаем новый элемент с тегом img
        const img = document.createElement('img');
        // Добавляем ему ссылку
        img.src = el;

        const div = document.createElement('div');
        div.classList.add('four', 'wide', 'column', 'ui', 'medium', 'image-wrapper');
      
        div.appendChild(img);
        this.imagesList.appendChild(div);
      }
    } else {
      // при отсутствии сразу деактивируем
      document.querySelector('.select-all').classList.add('disabled');
    }
  }

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText(){
    const images = this.imagesList.getElementsByTagName('img');
    const selectAll = document.querySelector('.select-all');
    const send = document.querySelector('.send');
    let checkForSelect = 1;
    let checkForSend = 0;
    // Проверяем состояние всех картинок
    for (let img of images) {
      // Если ни одна не выделена
      if (!img.classList.contains('selected')) {
        // Выставляем флаг для кнопки "Выбрать все"
        checkForSelect = 0;
      } else {
        // Иначе выставляем флаг для кнопки "Отправить на диск"
        checkForSend = 1;
      }
    }
    // Проверяем и меняем отображение кнопки при выборе картинки
    if (checkForSelect && images) {
      selectAll.textContent = 'Снять выделение';
    } else {
      selectAll.textContent = 'Выбрать всё';
    }
    // Делаем активной кнопку "Отправить на диск"
    if (checkForSend) {
      send.classList.remove('disabled');
    } else {
      send.classList.add('disabled');
    }
  }
}