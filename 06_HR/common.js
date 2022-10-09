// 个位数前面加0
function toFix2(num) {
    num = parseInt(num);
    return num < 10 ? "0" + num : num;
}


// 数组去重
function uniqeArr(arr) {
    let newArr = [];
    for (let i of arr) {
        if (i && !newArr.includes(i)) {
            newArr.push(i);
        }
    }
    return newArr;
}