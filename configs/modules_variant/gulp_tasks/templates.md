## Шаблоны кода для быстрой вставки

```
    //------------------------------
    // const  module = (nameFile) => require(path.tasks + nameFile)(gulp, );
    // gulp.task('', module(''));
    //------------------------------
    //------------------------------
    // const  module = (nameFile) => require(path.tasks + nameFile)(gulp, );
    // gulp.task('', module(''));
    //------------------------------
```


## Описание структуры таска на примере
name Module       name File  						name File		  path.src 	     path.build	   
```
const modulePug = (nameFile) => require(path.tasks + nameFile)(gulp, path.src.pug, path.build.html);
```
		   task	   module	   file 
```
 gulp.task('pug', modulePug('htmlBuild'));
```