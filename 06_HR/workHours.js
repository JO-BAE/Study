window.onload = function () {
    // 处理上传的考勤表
    let attendSheet = document.getElementById("attendSheet");
    attendSheet.onchange = function () {
        let staffList = document.getElementsByClassName("staffList")[0];
        // 创建 FileReader 示例
        let reader = new FileReader();
        // 读取文件
        reader.readAsBinaryString(this.files[0]);
        // 文件读取成功时的回调函数
        reader.onload = function (e) {
            // 以二进制流方式读取到整份的excel 表格对象
            let file = e.target.result;
            let workbook = XLSX.read(file, { type: "binary" });
            for (let i in workbook.Sheets) {
                // { defval: "" } 可选参数，保留空值
                let sheet = XLSX.utils.sheet_to_json(workbook.Sheets[i], { defval: "休" });
                // console.log(sheet)
                // 如果导入的表格数据不为空
                let sf = document.getElementsByClassName("sf")[0];
                if (sheet) {
                    sf.style.display = "none";
                }
                for (let data of sheet) {
                    let staffItem = addEle(staffList, "li", "staffItem");
                    let clockHeader = addEle(staffItem, "ul", "clockHeader");
                    let clockList = addEle(staffList, "ul", "clockList littleFont hide");
                    // console.log(data)
                    for (let key in data) {
                        if (/^[\u4e00-\u9fa5]{0,}$/.test(key)) {
                            if (key === "姓名") {
                                let sName = addEle(clockHeader, "li", "name");
                                sName.innerText = key + ": " + data[key];
                            }
                        } else {
                            // 打卡时间去重展示，5min以内算重复
                            let arr = data[key].split("\n");
                            let uArr = uniqeArr(arr);
                            for (let i = 0; i < uArr.length - 1; i++) {
                                let min = toMins(uArr[i + 1]) - toMins(uArr[i]);
                                if (min < 5) {
                                    uArr.splice(i + 1, 1);
                                }
                            }
                            // data[key] = uArr.join("\n");
                            // 展示打卡时间
                            let clockDate = addEle(clockList, "li", "clockDate");
                            let date = addEle(clockDate, "span", "date");
                            date.innerText = key;
                            if (uArr.length % 2 === 1 && uArr[0] !== "休") {
                                uArr.push("漏");
                            }
                            for (let v of uArr) {
                                let span = addEle(clockDate, "span", "littleFont");
                                span.innerText = v;

                            }
                        }
                    }
                    let addClock = addEle(clockHeader, "li", "addClock");
                    addClock.innerText = "总加钟: 10:11";
                    let cutClock = addEle(clockHeader, "li", "cutClock");
                    cutClock.innerText = "总消钟：10:11";
                    let totalClock = addEle(clockHeader, "li", "totalClock");
                    totalClock.innerText = "净加钟/消钟：10:11";
                    // break;
                }
            }

        }
    }
}

