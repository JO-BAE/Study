window.onload = function () {
    let s = "1111"
    console.log(s)
    s = s.replace('1', '2')
    console.log(s)
    // 处理上传的考勤表
    let attendSheet = document.getElementById("attendSheet");
    attendSheet.onchange = function () {
        // 创建 FileReader 示例
        let showPreview = new FileReader();
        // 读取文件
        showPreview.readAsBinaryString(this.files[0]);
        // 文件读取成功时的回调函数
        showPreview.onload = function (e) {
            let data = getData(e.target.result);
            console.log(data)
            for (let i of data) {
                for (let j in i) {
                    if (j === "姓名") {
                        // console.log(i[j]);
                    }
                    if (/[0-9]+/.test(j)) {
                        let arr = i[j].split("\n");
                        newArr = uniqeArr(arr);
                        i[j] = newArr.join("\n");
                    }
                }
                // break;
            }
        }
    }

    // 展开/收起功能
    let moreBtns = document.getElementsByClassName("moreBtn");
    for (let i of moreBtns) {
        i.onclick = function () {
            // 根据点击操作moreBtn类名
            if (this.className.includes('foldBtn')) {
                this.className = this.className.replace(' foldBtn', '');
            } else {
                this.className += ' foldBtn';
            }

            // 根据类名处理展开/收起
            if(this.className.includes('foldBtn')){
                this.innerText = "收起";

            }
        }
    }
}

function addEle(parent, element, content, className) {
    var ele = document.createElement(element);
    ele.innerText = content;
    ele.className = className;
    parent.appenChild(ele);
}

function getData(file) {
    let data = [];
    // 以二进制流方式读取到整份的excel 表格对象
    let workbook = XLSX.read(file, {
        type: 'binary'
    })
    // 遍历每张表读取
    for (let sheet in workbook.Sheets) {
        // 判断文件是否是 excel 文件
        if (workbook.Sheets.hasOwnProperty(sheet)) {
            // 对表格的内容进行处理
            data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            break; // 如果只取第一张表，就取消注释这行
        }
    }
    return data;
}
