/**
 * Created by ozknemoy on 18.05.2017.
 * npm install -g ts-node typescript
 * npm run "test": "nodemon test/unit-ts.js",
 * и вручную в окне рядом  "tsc -w test/unit-ts.ts"
 */

console.log('-------------------новый тест------------------');
const now = JSON.stringify(new Date()).slice(1, -1);
const arr = ['Идея', 'Стартап', 1];
const arrOfObj = [
    {id: 0, name: 'Россия', regions: [{id: 1, name: "Адыгея"}]},
    {id: 1, name: 'Беларусь ', regions: [{id: 2, name: "Минск"}]}
];
const arrObjTable = [
    {id: 0, item: "апвыва", amount: 0 / 0, description: "вапы"},
    {id: 1, item: "апвыапыва", amount: Infinity, description: "вапы вап"},
    {id: 2, item: "апвыапыва", amount: 345234.5, description: "вапы вап"},
    {id: 3, item: "вапвап", amount: "345234", description: "вапвап"}
];
const arrOfObjWithAll = [
    {name: 'неРоссия', regions: [{id: 1, name: "неАдыгея"}]},
    {id: 0, name: 'Россия', regions: [{id: 1, name: "Адыгея"}]},
    {id: 1, name: 'Беларусь ', regions: [{id: 2, name: "Минск"}]}
];
let success = 0;
let error = 0;
function assert(a, output, description) {
    // сравнивает простые типы
    if (a == output) {
        //console.log(`test ${description}:`,'success');
        success++
    }
    // сравнивает массивы и массивы объектов
    else if (testArray(a, output)) {
        //console.log(`test ${description}:`,'success');
        success++
    }
    // сравнивает объекты
    else if (equalObj(a, output)) {
        //console.log(`test ${description}:`,'success');
        success++
    }
    else {
        console.error(`test ${description}                             FAIL:`, a, ' => ', output);
        error++
    }
}
function assertCount(a, output, description, repeat = 100000) {
    console.time(description);
    for (var i = 0; i < repeat; i++) {
        assert(a, output, description)
    }
    console.timeEnd(description);
}
function testArray(arr, arr2) {// сравнение массивов
    if (arr == undefined || arr2 == undefined || arr.length != arr2.length) {
        console.error('lengths: ',arr.length,arr2.length,"_________testArray fail_______________")
        console.error(arr, arr2);
        console.error(' ____________________________');
        return false;
    }
    var on = 0;
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr2.length; j++) {
            if (arr[i] == arr2[j]) {
                on++;
                break
            } else if (equalObj(arr[i], arr2[j])) {// если внутри объект
                on++;
                break
            }
        }
    }
    return on == arr.length
}
function equalObj(first, second) {
    if (first === second) {
        return true;
    } else if (!first || !second || typeof first !== typeof second ||
        first.length !== second.length) {
        return false;
    } else {
        return equal(first, second, equalObj);
    }
}
function equal(first, second, recursion) {
    if (Array.isArray(first)) {
        return first.every(function (val, i) {
            return recursion(val, second[i]);
        });
    } else if (typeof first === 'object' && first !== null) {
        return Object.keys(first).every(function (val) {
            return recursion(first[val], second[val]);
        });
    } else {
        return first === second;
    }
}

//tsc -w test/unit-ts.ts         watch    запускать вмепсте с nodemon  test/unit-ts.js

import {HandleDataClass as HandleData} from '../src/services/handle-data.class'

var HD = new HandleData();

assert(HD.daysInMonth('2017-5-30 17:43:11'),31,'daysInMonth');
assert(HD.daysBeforeEndMonth('2017-5-30 17:43:12'),2,'daysBefoeEndMonth');
assert(HD.daysHoursBeforeEndMonth('2017-5-31 22:43:12'),1,'daysHorsBeforeEndMonth');
assert(HD.daysHoursBeforeEndMonth('2017-5-31 00:43:12'),23,'daysHorsBeforeEndMonth');
assert(HD.getNounFilter(12, 'день', 'дня', 'дней'), 'дней', 'getNounFilter');


//assert(HD.isToday('2017-05-24 00:43:12'),true,'daysInMonth1');
//assert(HD.isToday('2017-05-24 23:43:12'),true,'daysInMonth2');

assert(HD.isToday('2017-05-23 23:43:12'),false,'daysInMonth3');
assert(HD.isToday('2047-05-28 00:43:12'),false,'daysInMonth1');