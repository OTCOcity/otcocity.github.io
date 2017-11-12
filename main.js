$(document).ready(function () {

  var $body = $('body');
  $('#find-words').click(findWords);
  $('#generate-words').click(function () {
    $('.fld-char').each(function () {
      var alph = "абвгдежзиклмнопрстуюя";
      $(this).val(alph[Math.floor(Math.random()*alph.length)]);
    });
  });

  $body.on('mouseenter', '.word-list__item', function () {
    var way = $(this).data();

    var index = 1,
      $fld = $('.fld-cont'),
      $tr = $fld.find('tr');
    for (w in way.way) {

      var $inputCont = $tr.eq(way.way[w][1]).find('.fld-char__wrap').eq(way.way[w][0]);

      $inputCont.find('.fld-char__number').text(index);

      $inputCont.addClass('is-active');
      if (index === 1) {
        $inputCont.addClass('is-first');
      }

      index++;
    }


  })

  $body.on('mouseleave', '.word-list__item', function () {
    $('.fld-char__wrap').removeClass('is-active is-first');


  });


  $body.on('focus', '.fld-char', function () {
    $(this).select();
  });



});


var field = [0, 0, ''];
var resultWords = [];

function findWords() {

  // console.log(trie);

  resultWords = [];

  field = getField();


  getWords(field);

  // console.log(resultWords);

  var $wordList = $('.word-list');
  $wordList.html('');
  for (h in resultWords) {
    $('<h2 class="word-list__header">' + h + ' ' + GetNoun(h, 'буква', 'буквы', 'букв') + '</h2>').appendTo($wordList);
    for (w in resultWords[h]) {
      $('<div class="word-list__item">' + resultWords[h][w].word + '</div>').data('way', resultWords[h][w].way).appendTo($wordList);
    }
  }

  if (!resultWords.length) {
    $('<h2 class="word-list__header">Слов не найдено</h2>').appendTo($wordList);
  }

}


function getWords(field) {

  var path = [],
    way = [];


  for (var h = 0; h < field[1]; h++) {
    for (var w = 0; w < field[0]; w++) {

      path = [];
      way = [];

      checkAround(w, h, field.slice(0), path, way);

    }

  }


}


function getField() {

  var $table = $('.fld-cont'),
    $tr = $table.find('tr'),
    $input = $table.find('input'),
    h = $tr.length,
    w = $input.length / h,
    s = '';


  $input.each(function () {
    s += $(this).val()[0];
  });

  // console.log(w, h, s);

  return [w, h, s];
}


function getCharByIndexes(w, h, field) {

  return field[2][getIndexByIndexes(w, h, field)];

}
function getIndexByIndexes(w, h, field) {

  return h * field[0] + w;

}

function checkWord(path, way) {

  var t = trie;
  for (var i = 0; i < path.length; i++) {
    t = t[path[i]];
    if (t === undefined) return false;

  }

  if (t && t.t && path.length > 1) {

    var word = path.join('');

    if (resultWords[word.length] === undefined) resultWords[word.length] = {};

    resultWords[word.length][word.hashCode()] = {word: word, way: way};
  }

  return true;
}

function checkAround(w, h, field, path, way) {


  var char = getCharByIndexes(w, h, field);

  // console.log(w, h, char);

  path.push(char);
  way.push([w, h]);

  // console.log(char);
  field[2] = field[2].replaceAt(getIndexByIndexes(w, h, field), '0');


  if (checkWord(path, way)) {


    for (var ca of getAround(w, h, field)) {
      checkAround(ca[0], ca[1], field.slice(0), path.slice(0), way.slice(0));
    }
  }


}

function getAround(w, h, field) {


  var result = [],
    char;

  char = field[2][getIndexByIndexes(w - 1, h - 1, field)];
  if (char !== undefined && char !== '0' && w - 1 > -1 && h - 1 > -1) result.push([w - 1, h - 1, char]);

  char = field[2][getIndexByIndexes(w, h - 1, field)];
  if (char !== undefined && char !== '0' && h - 1 > -1) result.push([w, h - 1, char]);

  char = field[2][getIndexByIndexes(w + 1, h - 1, field)];
  if (char !== undefined && char !== '0' && w + 1 < field[1] && h - 1 > -1) result.push([w + 1, h - 1, char]);

  char = field[2][getIndexByIndexes(w - 1, h, field)];
  if (char !== undefined && char !== '0' && w - 1 > -1) result.push([w - 1, h, char]);

  char = field[2][getIndexByIndexes(w + 1, h, field)];
  if (char !== undefined && char !== '0' && w + 1 < field[1]) result.push([w + 1, h, char]);

  char = field[2][getIndexByIndexes(w - 1, h + 1, field)];
  if (char !== undefined && char !== '0' && w - 1 > -1 && h + 1 < field[1]) result.push([w - 1, h + 1, char]);

  char = field[2][getIndexByIndexes(w, h + 1, field)];
  if (char !== undefined && char !== '0' && h + 1 < field[1]) result.push([w, h + 1, char]);

  char = field[2][getIndexByIndexes(w + 1, h + 1, field)];
  if (char !== undefined && char !== '0' && w + 1 < field[1] && h + 1 < field[1]) result.push([w + 1, h + 1, char]);

  return result;
}

function GetNoun(number, one, two, five) {
  number = Math.abs(number);
  number %= 100;
  if (number >= 5 && number <= 20) {
    return five;
  }
  number %= 10;
  if (number == 1) {
    return one;
  }
  if (number >= 2 && number <= 4) {
    return two;
  }
  return five;
}

String.prototype.replaceAt = function (index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

String.prototype.hashCode = function () {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
