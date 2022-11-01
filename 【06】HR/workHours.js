window.onload = function () {
    // 处理上传的考勤表
    let attendSheet = document.getElementById("attendSheet");
    let month;
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
                // { defval: "" } 可选参数，为空单元格赋值
                let sheet = XLSX.utils.sheet_to_json(workbook.Sheets[i], { defval: "" });
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
                    // 处理打卡时间，去除重复，5min以内算重复
                    for (let key in data) {
                        let arr = data[key].split("\n");
                        let uArr = uniqeArr(arr);
                        for (let i = 0; i < uArr.length - 1; i++) {
                            let mins = toMins(uArr[i + 1]) - toMins(uArr[i]);
                            if (mins < 5) {
                                uArr.splice(i + 1, 1);
                            }
                        }
                        data[key] = uArr;
                    }
                    let addClocks = 0;
                    let cutClocks = 0;
                    for (let key in data) {
                        // console.log(key)
                        if (/^[\u4e00-\u9fa5]{0,}$/.test(key)) {
                            if (key === "姓名") {
                                let sName = addEle(clockHeader, "li", "name");
                                sName.innerText = key + ": " + data[key];
                            }
                        } else {
                            // 处理打卡时间，凌晨2点以前算前一天的打卡
                            let uArr = data[key];
                            let day = key.slice(3, 5);
                            let lastDay = toFix2(parseInt(day) + 1);
                            let lastKey = key.slice(0, 3) + key.slice(3).replace(day, lastDay);
                            if (lastKey in data) {
                                let fistClock = data[lastKey][0];
                                if (fistClock && toMins(fistClock) < 120) {
                                    // 当日添加凌晨打卡
                                    uArr.push(fistClock);
                                    // 次日去掉凌晨打卡
                                    data[lastKey].shift();
                                }
                            }
                            // 处理并展示打卡情况
                            let clockDate = addEle(clockList, "li", "clockDate");
                            let date = addEle(clockDate, "span", "date");
                            date.innerText = key;
                            if (uArr.length % 2 === 1) {
                                uArr.push("漏");
                            }
                            let workMins = 0;
                            let ruleMins = 8 * 60;
                            if (uArr[0]) {
                                if (!uArr.includes("漏")) {
                                    for (let i = 0; i < uArr.length - 1; i++) {
                                        if (i % 2 === 0) {
                                            // console.log(uArr[i])
                                            workMins += toMins(uArr[i + 1]) - toMins(uArr[i]);
                                            // 追加跨日计算
                                            if (toMins(uArr[i + 1]) < 120) {
                                                workMins += 24 * 60;
                                            }
                                        }
                                    }
                                    // 一天2/4趟卡，统一按四趟卡展示，不足用空值补上，整齐展示
                                    while (uArr.length !== 4) {
                                        uArr.push("");
                                    }
                                    let countMins = workMins - ruleMins;
                                    // 每30min划半个钟
                                    let midCMins = 30;
                                    let nMClock = 0;
                                    if (countMins > 0) {
                                        // 加钟采取去尾法
                                        nMClock = Math.floor(countMins / midCMins);
                                        addClocks += nMClock / 2;
                                    } else {
                                        // 消钟采取进1法
                                        nMClock = Math.ceil(countMins / midCMins);
                                        cutClocks += Math.abs(nMClock) / 2;
                                    }
                                    if (nMClock !== 0) {
                                        uArr.push("————", "加钟消钟", nMClock / 2);
                                    }
                                }
                            } else {
                                uArr.push("休");
                            }
                            for (let v of uArr) {
                                let span = addEle(clockDate, "span", "littleFont");
                                span.innerText = v;
                            }
                        }
                    }
                    let addClock = addEle(clockHeader, "li", "addClock");
                    addClock.innerText = "总加钟: " + addClocks;
                    let cutClock = addEle(clockHeader, "li", "cutClock");
                    cutClock.innerText = "总消钟：" + cutClocks;
                    let totalClock = addEle(clockHeader, "li", "totalClock");
                    totalClock.innerText = "净加钟消钟：" + (addClocks - cutClocks);
                    // break;
                }
            }

        }
    }

    // 加钟消钟字符串模板
    // --
}

