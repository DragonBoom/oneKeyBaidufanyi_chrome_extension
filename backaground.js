chrome.runtime.onInstalled.addListener(addListener);
chrome.runtime.onStartup.addListener(addListener);
function addListener() {
    
    // 当启用browser_action时，该监听器失效
    // chrome.browserAction.onClicked.addListener(function (tab) {
        // do nothing
    // })
        
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        console.log(changeInfo);
        if (changeInfo.status == "loading" && changeInfo.url && !changeInfo.url.startsWith('chrome')) {
            // chrome.tabs.executeScript({
            //     file: "baidufanyi.js"
            // });
        }
    })

    chrome.commands.onCommand.addListener(function (command) {
        console.log('Command' + command);
        if (command == 'toggle1') {
            // 查询激活的标签页
            // 若只有1个标签页被激活，且该标签页不是chrome特定页面（无法执行js），才执行翻译js

            var baidufanyiInfo = {
                url: '*://fanyi.baidu.com/*'
            }

            // 判断当前页面是否可访问，若可访问再进行后续处理
            var queryInfo = {
                highlighted: true
            };
            chrome.tabs.query(queryInfo, function (tabs) {
                if (tabs.length > 1) {
                    console.log('请勿选中多个标签页');
                }
                var tab = tabs[0];
                if (!tab.url || tab.url.startsWith('chrome')) {
                    console.log('无法作用于当前页面 url=' + (tab && tab.url || ' not found'))
                    return;// over
                }

                // 获取当前页面选中内容
                chrome.tabs.executeScript({
                    code: 'window.getSelection().toString()'
                }, results => {
                    var selected = results[0];
                    // build url
                    var url = 'https://fanyi.baidu.com/translate?#en/zh/' + selected;

                    // 查找百度翻译标签页
                    chrome.tabs.query(baidufanyiInfo, function (tabs) {
                        if (tabs.length == 0) {
                            // 没有百度翻译标签页，新建一个
                            chrome.tabs.create({
                                url: url,
                                active: true// 跳转到该标签页
                            })
                        } else {
                            // 有百度翻译标签页，更新其地址
                            var tab = tabs[0];// 不考虑次序
                            chrome.tabs.update(tab.id, {
                                url: url,
                                active: true// 跳转到该标签页
                            })
                        }
                    })

                });
            })


        }
        // chrome.tabs.getCurrent(function (tab) {console.log(tab)})// not work
    });
}