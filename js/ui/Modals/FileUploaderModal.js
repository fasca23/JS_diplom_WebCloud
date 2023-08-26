/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
  constructor( element ) {
    super(element);
    // Пытаемся не потерять this
    this.showImages = this.showImages.bind(this);
    this.registerEvents();
    
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: 
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents(){
    let that = this;
    const xIcon = this.dom.getElementsByTagName('i')[0];
    xIcon.addEventListener('click', () => {
      // при клике запускаем метод из BaseModal
      that.close();
    });
    
    const close = this.dom.querySelector('.close');
    close.addEventListener('click', () => {
      that.close();
    });

    const sendAll = this.dom.querySelector('.send-all');
    sendAll.addEventListener('click', () => {
      that.sendAllImages();
    });

    const contentBlock = this.dom.querySelector('.content');
    contentBlock.addEventListener('click', (event) => {
      if (event.target.closest('div').classList.contains('input')) {
        event.target.closest('div').classList.remove('error');
      } 
      if (event.target.tagName == 'BUTTON' || event.target.tagName == 'I') {
        const input = event.target.closest('.image-preview-container');
        that.sendImage(input);
      }
    });
  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages(images) {
    images.reverse();
    let blocks = [];
    for (let item of images) {
      const block = this.getImageHTML(item);
      blocks.push(block);
    }
    const contentBlock = this.dom.querySelector('.content');
    contentBlock.innerHTML = blocks.join('');
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
//   4. Метод `getImageHTML` возвращает строку формата:
// ```javascript
// <div class="image-preview-container">
//   <img src='XXX' />
//   <div class="ui action input">
//     <input type="text" placeholder="Путь к файлу">
//     <button class="ui button"><i class="upload icon"></i></button>
//   </div>
// </div>
// ```
// где `XXX` путь к изображению.

  getImageHTML(item) {
    const img = document.createElement('img');
    img.src = item.src;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Путь к файлу';

    const btn = document.createElement('button');
    btn.classList.add('ui', 'button');

    const i = document.createElement('i');
    i.classList.add('upload', 'icon');

    btn.appendChild(i);
    const divInput = document.createElement('div');
    divInput.classList.add('ui', 'action', 'input');
    divInput.appendChild(input);
    divInput.appendChild(btn);

    const divContainer = document.createElement('div');
    divContainer.classList.add('image-preview-container');
    divContainer.appendChild(img);
    divContainer.appendChild(divInput);
    // получаем html в виде строки
    const str = divContainer.outerHTML;
    return str;
  }

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages() {
    const containers = this.dom.querySelectorAll('.image-preview-container');
    for (let container of containers) {
      this.sendImage(container);
    }
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage(imageContainer) {
    let that = this;
    const input = imageContainer.getElementsByTagName('input')[0];
    if (!input.value.trim()) {
      // Ищем ближайщего родителя и добавлеме ему еррор
      input.closest('input').classList.add('error');
      // return;
    } 
    input.closest('input').classList.add('disabled');
    let src = imageContainer.firstChild.src;
    const path = input.value;

    function removeClose() {
      const content = imageContainer.closest('.content');
      // Удаляем блок контейнер добавленного изображения.
      imageContainer.remove();
      // Если не осталось никаких изображений в модалке, то закрываем модальное окно.
      if (!content.firstElementChild) {
        that.close();
      }
    }
    Yandex.uploadFile(path, src, removeClose);
  }
}