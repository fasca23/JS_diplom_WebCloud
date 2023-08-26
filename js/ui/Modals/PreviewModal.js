/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {
  constructor( element ) {
    super(element);
    this.showImages = this.showImages.bind(this);
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения: 
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    let that = this;
    const xIcon = this.dom.getElementsByTagName('i')[0]
    xIcon.addEventListener('click', () => {
      that.close();
    });

    const contentBlock = this.dom.querySelector('.content');
    contentBlock.addEventListener('click', (elem) => {
      if (elem.target.classList.contains('delete')) {
        const parent = elem.target.closest('.image-preview-container');
        parent.querySelector('.trash').classList.add('icon', 'spinner', 'loading');
        elem.target.classList.add('disabled');
        const path = elem.target.dataset.path;
        
        function deleteBlock(err) {
          if (err == null) {
            parent.remove();
          }
        }
        Yandex.removeFile(path, deleteBlock);

        // ???
        // Скачиваться чего-то не хочет.......
      } else if (elem.target.classList.contains('download')) {
        // const parent = elem.target.closest('.image-preview-container');
        // const url = parent.getElementsByTagName('img')[0].src;
        const url = elem.target.dataset.file;
        Yandex.downloadFileByUrl(url);
      }
    });
  }


  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  showImages(err, data) {
    const images = data.items;
    images.reverse();
    let blocks = [];
    for (let img of images) {
      const block = this.getImageInfo(img);
      blocks.push(block);
    }
    const contentBlock = this.dom.querySelector('.content');
    contentBlock.innerHTML = blocks.join('');
  }

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   * */
  formatDate(date) {
    const d = new Date(date);
    const day = d.getDate();
    const year = d.getFullYear();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    // Январь это нулевый месяц у getMonth()....
    const months = {
      0: 'января', 
      1: 'февраля', 
      2: 'марта', 
      3: 'апреля', 
      4: 'май', 
      5: 'июня', 
      6: 'июля', 
      7: 'августа', 
      8: 'сентября', 
      9: 'октября', 
      10: 'ноября', 
      11: 'декабря'
    }
    const month = months[d.getMonth()];
    return `${day} ${month} ${year} г. в ${hours}:${minutes}`;
  }

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */

  getImageInfo(item) {
    let that = this;
    // <div class="image-preview-container">
    const div = document.createElement('div');
    div.classList.add('image-preview-container');

    // <img src='XXX' />
    // `XXX` путь к изображению
    const img = document.createElement('img');
    img.src = item.preview;
    // Ставим у img родителем div
    div.appendChild(img);

    // <table class="ui celled table"></table>
    const table = document.createElement('table');
    table.classList.add('ui', 'celled', 'table');

    // <thead>
    // <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
    // </thead>
    const thead = document.createElement('thead');
    const tr1 = document.createElement('tr');

    const th1 = document.createElement('th');
    th1.innerHTML = 'Имя';
    const th2 = document.createElement('th');
    th2.innerHTML = 'Создано';
    const th3 = document.createElement('th');
    th3.innerHTML = 'Размер';

    tr1.appendChild(th1);
    tr1.appendChild(th2);
    tr1.appendChild(th3);
    thead.appendChild(tr1);
    table.appendChild(thead);

    // <tbody>
    // <tr><td>AAA</td><td>BBB</td><td>CCCКб</td></tr>
    // </tbody>
    const tbody = document.createElement('tbody');
    const tr2 = document.createElement('tr');

    const td1 = document.createElement('td');
    td1.append(item.name);
    const td2 = document.createElement('td');
    td2.append(that.formatDate(item.created));
    const td3 = document.createElement('td');
    const size = item.size;
    // переводим в Килобайты и округляем до десятых
    td3.append((size/1024).toFixed(1) + 'Кб');
    tr2.appendChild(td1);
    tr2.appendChild(td2);
    tr2.appendChild(td3);
    tbody.appendChild(tr2);
    table.appendChild(tbody);
    div.appendChild(table);

  //   <div class="buttons-wrapper">
  //   <button class="ui labeled icon red basic button delete" data-path='PPP'>
  //     Удалить
  //     <i class="trash icon"></i>
  //   </button>
  //   <button class="ui labeled icon violet basic button download" data-file='FFF'>
  //     Скачать
  //     <i class="download icon"></i>
  //   </button>
  // </div>

    const iTrash = document.createElement('i');
    iTrash.classList.add('trash', 'icon');
    const btnDelete = document.createElement('button');
    btnDelete.classList.add('ui', 'labeled', 'icon', 'red', 'basic', 'button', 'delete');
    // data-path='PPP'>
    btnDelete.dataset.path = item.path;
    btnDelete.append('Удалить');
    btnDelete.appendChild(iTrash);

    // <i class="download icon"></i>
    const iDownload = document.createElement('i');
    iDownload.classList.add('download', 'icon');

    const btnDownload = document.createElement('button');
    btnDownload.classList.add('ui', 'labeled', 'icon', 'violet', 'basic', 'button', 'download');

    // data-file='FFF'>
    btnDownload.dataset.file = item.file;
    btnDownload.append('Скачать');

    btnDownload.appendChild(iDownload);

    const divBW = document.createElement('div');
    divBW.classList.add('buttons-wrapper');

    divBW.appendChild(btnDelete);
    divBW.appendChild(btnDownload);
    div.appendChild(divBW);

    const str = div.outerHTML;
    return str;
  }

  // Пытался сделать по другому - все равно не качает.... но отображает

  // getImageInfo(item) {
	//   let size = Math.round(item.size/1024);
	  
	//   let html = `
	// 	<div class="image-preview-container">
	// 	  <img src=${item.file}>
	// 	  <table class="ui celled table">
	// 	  <thead>
	// 	    <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
	// 	  </thead>
	// 	  <tbody>
	// 	    <tr><td>${item.name}</td><td>${this.formatDate(item.created)}</td><td>${size}Кб</td></tr>
	// 	  </tbody>
	// 	  </table>
	// 	  <div class="buttons-wrapper">
	// 	    <button class="ui labeled icon red basic button delete" data-path="${item.path}">
	// 	      Удалить
	// 	      <i class="trash icon"></i>
	// 	    </button>
	// 	    <button class="ui labeled icon violet basic button download" data-file="${item.file}">
	// 	      Скачать
	// 	      <i class="download icon"></i>
	// 	    </button>
	// 	  </div>
	// 	</div>
	// `;
	// return html;
  // }

}