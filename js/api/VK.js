
  /**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {

  static ACCESS_TOKEN = '';
  static lastCallback;
  static BaseUrl = 'https://api.vk.com/method/'
  
  /**
   * Получает изображения
   * */
  static get(id = '', callback){
    // 1. Переданный колбек сохранить в свойство `lastCallback` (для дальнейшей обработки). 
    this.lastCallback = callback;
    // Готовим все для script
    const script = document.createElement('script');
    script.id = 'addedScript';
    script.src = this.BaseUrl + 'photos.get?owner_id=' + id + '&album_id=profile&access_token=' + this.ACCESS_TOKEN + '&rev=1&v=5.131&callback=VK.processData';
    // Добавляем script
    // 2. Создать тег `script`, который будет добавляться в документ для выполнения запроса.
    document.getElementsByTagName('body')[0].appendChild(script);
  }

  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  // `VK.processData` для обработки ответа.
  static processData(result){
    // 1. Чтобы документ не засорялся добавленными тегами `script` необходимо найти и удалить тег `script`, который добавлялся для выполнения запроса.
    document.getElementById('addedScript').remove();
    result.onerror = () => {
    // 2. В случае возникновения ошибки выводите её в `alert` и завершайте выполнение обработчика ответа от сервера.
      alert('Не удалось загрузить скрипт!');
      return;
    };
    
    // 3. Найдите самые крупные изображения из ответа от сервера и передайте изображения в колбек, который передавался в метод `VK.get`, который сохранялся в `lastCallback`.
    const types = ['w', 'z', 'y', 'x', 'r', 'q', 'p', 'm', 'o', 's'];
    
    // Выбираем самый большой размер 
    function biggest(sizes) {
      for (let type of types) {
        for (let size of sizes) {
          if (type === size.type) {
            return size;
          }
        }
      }
    }
    // Выбираем все ссылки на изображения с этим размером
    for (let img of result.response.items) {
      img['sizes'] = biggest(img['sizes']);
    }
    // Собираем все эти ссылки
    let choosedImages = [];
    for (let item of result.response.items) {
      choosedImages.push(item.sizes.url);
    }

    // 4. Обновите свойство `lastCallback` на функцию "пустышку" `() => {}`.
    this.lastCallback(choosedImages);
    this.lastCallback = () => {};
  }
}