addLayer("1layer", {
    name: "sideLayer1",
    position: -1,
    row: 0,
    symbol() {return '↓ 初入茅坑 ↓'}, // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N() {return '↓ layer 1 ↓'}, // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled (in mod.js)
    small: true,// Set to true to generate a slightly smaller layer node
    nodeStyle: {"font-size": "15px", "height": "30px"},// Style for the layer button
    startData() { return {
        unlocked: true,
        points: new Decimal(0),// This currently does nothing, but it's required. (Might change later if you add mechanics to this layer.)
    }},
    color: "#fefefe",
    type: "none",
    tooltip(){return false},
    layerShown(){return layerDisplayTotal(['p'])},// If any layer in the array is unlocked, it will returns true. Otherwise it will return false.
	tabFormat: [
        ["display-text", function() { return getPointsDisplay() }]
    ],
})

addLayer("p", {
    name: "金币底数", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "金币底数", // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N: "金币底数", // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 0, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal("0"),
        best: new Decimal("0"),
    }},
    color: "#eaff00e7",
    requires: new Decimal("10"), // Can be a function that takes requirement increases into account
    resource: "金币底数", // Name of prestige currency
    resourceI18N: "金币底数", // Second name of the resource for internationalization (i18n) if internationalizationMod is enabled
    baseResource: "金币", // Name of resource prestige is based on
    baseResourceI18N: "points", // Second name of the baseResource for internationalization (i18n) if internationalizationMod is enabled
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    softcap: new Decimal("3.4e38"),
    softcapPower: new Decimal("0.65"),
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal("1")
        if (hasUpgrade('cs1', 13)) mult = mult.mul(player.cs1.points.mul(0.25).add(1).pow(0.4))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        if (hasMilestone('cs2', 4)) return new Decimal(1.03)
        return new Decimal(1)
    },
    upgrades: {
        11: {
            title: "让底数有效果",
            description: "每秒获取(金币底数+1)个金币",
            cost: new Decimal(5),
            effect() {
        return player[this.layer].points.add(1)
        }, // Calculate the effect of the upgrade. Can be a function that takes into account current game state.
         effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
    },
    milestones: {
    1: {
        requirementDescription: "达到1.00e10金币底数", // Optional text. Use if the milestone has no effect
        effectDescription: "奖励:解锁一个新层级",
        done() { return player.p.points.gte(1e10) },
    }
    },
    doReset(resettingLayer) {
        if (resettingLayer === "p") return
        //let keep = tmp[resettingLayer].row > tmp.p.row ? ["milestones", "upgrades"] : []
        let keep = tmp[resettingLayer].row > tmp.p.row ? ["milestones", "best"] : ["best"]
        if(hasUpgrade('cs2',13)) keep = tmp[resettingLayer].row > tmp.p.row ? ["milestones", "upgrades", "best"] : ["best"]
        layerDataReset("p", keep)
    },
    microtabs:{
        tab:{
            "main":{
                name(){return '基础升级'}, // Name of tab button
                nameI18N(){return 'main'}, // Second name for internationalization (i18n) if internationalizationMod is enabled
                content:[
                    ['upgrade', 11],
                ],
            },
            "another":{
                name(){return '里程碑'},
                nameI18N(){return 'another'},
                content:[['milestones', 1],
                ],
            }
        },
    },
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       "main-display",
       "prestige-button",
       ["display-text", function() { return "资源序列#1" }],
       ["display-text", function() { return "<br>历史最大值：" + formatWhole(player.p.best) + "金币底数" }],
       "blank",
       ["microtabs","tab"]
    ],
    layerShown(){return true},
    
})
addLayer("cs1", {
    name: "第一乘数", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "第一乘数", // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N: "第一乘数", // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 1, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal("0"),
        best: new Decimal("0"),
    }},
    color: "#ff0000",
    requires: new Decimal("1e11"), // Can be a function that takes requirement increases into account
    resource: "第一乘数", // Name of prestige currency
    resourceI18N: "第一乘数", // Second name of the resource for internationalization (i18n) if internationalizationMod is enabled
    baseResource: "金币", // Name of resource prestige is based on
    baseResourceI18N: "points", // Second name of the baseResource for internationalization (i18n) if internationalizationMod is enabled
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.1, // Prestige currency exponent
    softcap: new Decimal("3.4e38"),
    softcapPower: new Decimal("0.65"),
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal("1")
        if (hasUpgrade('cs1', 14)) mult = mult.mul(player.p.points.add(1).log10().add(1).pow(0.5))
        if (hasUpgrade('cs2', 12)) mult = mult.mul(upgradeEffect('cs2', 12))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        if (hasMilestone('cs2', 4)) return new Decimal(1.1)
        return new Decimal(1)
    },
    upgrades: {
        11: {
            title: "MUL1",
            description: "金币获取乘以(第一乘数+1)",
            cost: new Decimal(3),
            effect() {
        return player[this.layer].points.add(1)
        }, // Calculate the effect of the upgrade. Can be a function that takes into account current game state.
         effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        13: {
            title: "倍增器",
            description: "第一乘数以极其微弱的倍率加成金币底数获取",
            cost: new Decimal(10),
            effect() {
        return player[this.layer].points.mul(0.01).add(1).pow(0.2)
        }, // Calculate the effect of the upgrade. Can be a function that takes into account current game state.
         effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        14: {
            title: "助推器",
            description: "金币底数以极其微弱的倍率加成第一乘数获取",
            cost: new Decimal(25),
            effect() {
        return player.p.points.add(1).log10().add(1).pow(0.5)
        }, // Calculate the effect of the upgrade. Can be a function that takes into account current game state.
         effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
    },
     doReset(resettingLayer) {
        if (resettingLayer === "cs1") return
        //let keep = tmp[resettingLayer].row > tmp.p.row ? ["milestones", "upgrades"] : []
        let keep = tmp[resettingLayer].row > tmp.cs1.row ? ["milestones", "best"] : ["best"]
        layerDataReset("cs1", keep)
        if (tmp[resettingLayer].row == tmp.cs2.row && hasMilestone("cs2", 3)) {
            player.cs1.points = new Decimal("5e5")
        }
    },
    milestones: {
    1: {
        requirementDescription: "达到1,000,000第一乘数", // Optional text. Use if the milestone has no effect
        effectDescription: "奖励:解锁一个新层级",
        done() { return player.cs1.points.gte(1e6) },
    }
    },    
    microtabs:{
        tab:{
            "main":{
                name(){return '升级'}, // Name of tab button
                nameI18N(){return 'main'}, // Second name for internationalization (i18n) if internationalizationMod is enabled
                content:[
                    ['row', [
                        ['upgrade', 11], ['upgrade', 13], ['upgrade', 14]
                    ]]
                ],
            },
            "another":{
                name(){return '里程碑'},
                nameI18N(){return 'another'},
                content:[
                    ['milestones',1]
                ],
            }
        },
    },
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       "main-display",
       "prestige-button",
       ["display-text", function() { return "资源序列#2" }],
       ["display-text", function() { return "<br>历史最大值：" + formatWhole(player.cs1.best) + "第一乘数" }],
       "blank",
       ["microtabs","tab"]
    ],
    layerShown(){if(hasMilestone('p', 1)||player.cs1.points.gte(1)) { return true } },
})

addLayer("cs2", {
    name: "第二乘数", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "第二乘数", // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N: "第二乘数", // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 2, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal("0"), 
        best: new Decimal("0"),
    }},
    color: "#ff7700",
    requires: new Decimal("1e6"), // Can be a function that takes requirement increases into account
    resource: "第二乘数", // Name of prestige currency
    resourceI18N: "第二乘数", // Second name of the resource for internationalization (i18n) if internationalizationMod is enabled
    baseResource: "第一乘数", // Name of resource prestige is based on
    baseResourceI18N: "points", // Second name of the baseResource for internationalization (i18n) if internationalizationMod is enabled
    baseAmount() {return player.cs1.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.1, // Prestige currency exponent
    softcap: new Decimal("3.4e38"),
    softcapPower: new Decimal("0.6"),
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal("1")
        if (hasUpgrade('cs2', 14)) mult = mult.mul(upgradeEffect('cs2', 14))
        if (hasMilestone('cs2', 1)) mult = mult.mul(2)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    upgrades: {
        11: {
            title: "MUL2",
            description: "金币获取x(第二乘数+1)",
            cost: new Decimal(0),
            effect() {
        return player[this.layer].points.add(1)
        }, // Calculate the effect of the upgrade. Can be a function that takes into account current game state.
        effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        12: {
            title: "倍增器<sup>2</sup>",
            description: "第二乘数以极其微弱的倍率加成第一乘数获取",
            cost: new Decimal(2),
            effect() {
        return player[this.layer].points.mul(2).add(2).pow(0.15)
        }, // Calculate the effect of the upgrade. Can be a function that takes into account current game state.
        effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        13: {
            title: "读写器",
            description: "不再重置金币底数层的升级",
            cost: new Decimal(1),
        },
        14: {
            title: "助推器<sup>2</sup>",
            description: "第一乘数以极其微弱的倍率加成第二乘数获取",
            cost: new Decimal(10),
            effect() {
        return player.cs1.points.add(1).log(40).add(1).pow(0.7)}, // Calculate the effect of the upgrade. Can be a function that takes into account current game state.
        effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
    },
    milestones: {
    1: {
        requirementDescription: "达到5.00第二乘数", // Optional text. Use if the milestone has no effect
        effectDescription: "奖励:第二乘数获取x2.00",
        done() { return player.cs2.points.gte(5) },
    },
    2: {
        requirementDescription: "达到25.00第二乘数", // Optional text. Use if the milestone has no effect
        effectDescription: "奖励:金币获取^1.05",
        done() { return player.cs2.points.gte(25) },
    },
    3: {
        requirementDescription: "达到200.00第二乘数", // Optional text. Use if the milestone has no effect
        effectDescription: "奖励:本层每次进行声望重置时，第一乘数=0 → =500,000<br>解锁购买项微标签页和可重复购买项",
        done() { return player.cs2.points.gte(200) },
    },
    4: {
        requirementDescription: "达到1.00e110金币", // Optional text. Use if the milestone has no effect
        effectDescription: "奖励:第一乘数获取^1.1 | 金币底数获取^1.03",
        done() { return player.points.gte("1.00e110") },
    },
    },    
    buyables: {
        2: {
            title: "锻体器",
            display() {
                return  "快速增加金币获取以获取更大的突破\n每购买一次使金币获取x4.00\n花费公式为 3.00^x 第二乘数" + 
                    "\n\n当前效果:金币获取 x" + format(this.effect()) +
                    "\n花费: " + format(this.cost()) + " 第二乘数" +
                    "\n\n已购买: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" +format(this.purchaseLimit)
            },
            cost(amount) {
                return new Decimal(3).pow(amount)
            },
            effect(amount) {
                return new Decimal(4).pow(amount)
            },
            purchaseLimit:6,
            unlocked() {
                return hasMilestone("cs2", 3)
            },
            canAfford() {
                return player.cs2.points.gte(this.cost())
            },
            buy() {
                player.cs2.points = player.cs2.points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
        },
    },
    microtabs:{
        tab:{
            "main":{
                name(){return '升级'}, // Name of tab button
                nameI18N(){return 'main'}, // Second name for internationalization (i18n) if internationalizationMod is enabled
                content:[
                    //["display-text", function() { return "0010<br>金币数量：" + format(player.points) }],
                    ['row', [
                        ['upgrade', 11], ['upgrade', 12],['upgrade', 13], ['upgrade', 14]
                    ]]
                ],
            },
            "c":{
                name(){return '购买项'},
                nameI18N(){return 'another'},
                unlocked() {
                    return hasMilestone("cs2", 3)
                },
                content:[
                    ['buyable',2]
                ],
            },
            "another":{
                name(){return '里程碑'},
                nameI18N(){return 'another'},
                content:[
                    ['milestones',4]
                ],
            },

        },
    },
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       "main-display",
       "prestige-button",
       ["display-text", function() { return "资源序列#3" }],
       ["display-text", function() { return "<br>历史最大值：" +formatWhole(player.cs2.best) + "第二乘数" }],
       "blank",
       ["microtabs","tab"]
    ],
    layerShown(){if(hasMilestone('cs1', 1)||player.cs2.points.gte(1)) { return true } },
})
// You can delete the second name from each option if internationalizationMod is not enabled.
// You can use function i18n(text, otherText) to return text in two different languages. Typically, text is English and otherText is Chinese. If changedDefaultLanguage is true, its reversed