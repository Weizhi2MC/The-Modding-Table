function layerDisplay(id){
    if(tmp[id].layerShown===undefined){
        return true
    }
    return tmp[id].layerShown
}

function layerDisplayTotal(id){
    for(i in id){
        let a = layerDisplay(id[i])
        if(a==true){
            return true
        }
    }
}

addLayer("SideTab", {
    name: "AllLayer",
    position: -999,
    row: 0,
    symbol() {return i18n('其他页面', 'Side Tab', false)},
    nodeStyle: {"font-size": "15px", "text-center": "center", "height": "30px"},
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    small: true,
    color: "#fefefe",
    type: "none",
    tooltip(){return false},
    layerShown(){return layerDisplayTotal(['Setting','Statistics','Information','Changelog'])},
    tabFormat: [
        ["display-text", function() { return getPointsDisplay() }],
    ],
})

addLayer("Setting", {
    name: "Setting",
    position: -998,
    row: 0,
    symbol() {return i18n('设置', 'Setting', false)},
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "rgb(230, 230, 236)",
    type: "none",
    tooltip(){return false},
    tabFormat: [
        ["display-text", function() { return getPointsDisplay() }],
    ],
})

addLayer("Information", {
    name: "Information",
    position: -997,
    row: 0,
    symbol() {return i18n('信息', 'Information', false)},
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "rgb(230, 230, 236)",
    type: "none",
    tooltip(){return false},
    tabFormat: [
        ["display-text", function() { return getPointsDisplay() }],
    ],
})

addLayer("Changelog", {
    name: "Changelog",
    position: -996,
    row: 0,
    symbol() {return i18n('更新日志', 'Changelog', false)},
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "rgb(230, 230, 236)",
    type: "none",
    tooltip(){return false},
    tabFormat: [
        ["display-text", function() { return getPointsDisplay() }],
    ],
})

addLayer("A", {
    name: "Achievement",
    position: -995,
    row: 0,
    symbol() {return i18n('成就', 'Achievement', false)},
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "rgb(174, 255, 34)",
    resource: "已完成的成就",
    type: "none",
    tooltip(){return false},
    achievements:{
        1:{
            name:"a1<br>开始游戏",
            done(){return player.points.gte(5)},
            tooltip:'解锁条件:金币数量≥5',
            onComplete(){player.A.points = new Decimal(player.A.points.add(1))}
        },
        2:{
            name:"a2<br>底数",
            done(){return player.p.points.gte(1)},
            tooltip:'解锁条件:金币底数≥1',
            onComplete(){player.A.points = new Decimal(player.A.points.add(1))}
        },
        3:{
            name:"a3<br>更快得增长I",
            done(){return player.p.points.gte(100)},
            tooltip:'解锁条件:金币底数≥100',
            onComplete(){player.A.points = new Decimal(player.A.points.add(1))}
        },
        4:{
            name:"a4<br>更快得增长II",
            done(){return player.p.points.gte(100000)},
            tooltip:'解锁条件:金币底数≥100000',
            onComplete(){player.A.points = new Decimal(player.A.points.add(1))}
        },
        5:{
            name:"a5<br>#FF0000",
            done(){return player.cs1.points.gte(1)},
            tooltip:'解锁条件:第一乘数≥1',
            onComplete(){player.A.points = new Decimal(player.A.points.add(1))}
        },
        6:{
            name:"a6<br>软上限",
            done(){return player.p.points.gte(3.4e38)},
            tooltip:'解锁条件:金币底数≥3.4e38',
            onComplete(){player.A.points = new Decimal(player.A.points.add(1))}
        },
        7:{
            name:"a7<br>2nd Mul",
            done(){return player.cs2.points.gte(1)},
            tooltip:'解锁条件:第二乘数≥1',
            onComplete(){player.A.points = new Decimal(player.A.points.add(1))}
        },
    },
    doReset() {
        layerDataReset("A", ["achievements", "points"])
    },

    microtabs:{
        tab:{
            "main":{
                name(){return '常规成就'}, // Name of tab button
                nameI18N(){return 'main'}, // Second name for internationalization (i18n) if internationalizationMod is enabled
                content:[
                    ['row',[
                    ['achievement', 1],['achievement', 2],['achievement', 3],['achievement', 4],['achievement', 5],['achievement', 6],['achievement', 7]]
                ],            
                ],
            },
        },
    },
        tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       "main-display",
       "blank",
       ["microtabs","tab"]
    ],
})
