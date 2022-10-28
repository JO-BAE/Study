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

// 添加元素
function addEle(parent, element, className) {
    let ele = document.createElement(element);
    ele.className = className;
    parent.appendChild(ele);
    return ele;
}

// 00:00 转化为 分钟数，如10:00 转化为 600
function toMins(time) {
    let arr = time.split(":");
    let mins = arr[0] * 60 + Number(arr[1]);
    return mins;
}

// 与上面相反
function toTime(mins) {
    let h = parseInt(mins / 60);
    let m = mins % 60;
    let time = Math.abs(h) + ":" + toFix2(Math.abs(m));
    if (h < 0 || m < 0) {
        time = "-" + time;
    }
    return time;
}