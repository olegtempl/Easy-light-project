# Easy-light-project

Сейчас исправляю:
- Продакшэн обработку 
- спрайты + scss миксины

В планах:

- запуск серверов по флагам  
- другие системы документирования
- интегрировать instanbul.js


#### Валидация
В данном проекте стоит стандарт (airbnb)[https://github.com/leonidlebedev/javascript-airbnb],под свои нужды  вы можете сконфигурировать файл заново 
командой:

    ```
    ./node_modules/.bin/eslint --init
    ```

#### Тестирование
Тестирование может осуществляться с помощью (jasmine)[https://github.com/jasmine/jasmine-npm] или (mocha)[https://github.com/mochajs/mocha].
В файлах спецификаций для (jasmine)[test/jasmine/spec.js] и (mocha)[test/mocha/spec.js]
указываются пути к тестируемым файлах, они подключаются как модули.

#### Важно
"rollup-plugin-commonjs": "^8.4.1", <= устанавливайте эту версию, иначе работать не будет




