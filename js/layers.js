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
		points: new Decimal(0),
    }},
    color: "#eaff00",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "金币底数", // Name of prestige currency
    resourceI18N: "金币底数", // Second name of the resource for internationalization (i18n) if internationalizationMod is enabled
    baseResource: "金币", // Name of resource prestige is based on
    baseResourceI18N: "points", // Second name of the baseResource for internationalization (i18n) if internationalizationMod is enabled
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    upgrades: {
        11: {
            title: "让底数有效果",
            description: "每秒获取金币底数+1个金币",
            cost: new Decimal(10),
            effect() {
        return player[this.layer].points.add(1)
        }, // Calculate the effect of the upgrade. Can be a function that takes into account current game state.
         effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
    },
    milestones: {
    1: {
        requirementDescription: "达到1.00e10金币底数", // Optional text. Use if the milestone has no effect
        effectDescription: "解锁一个新层级",
        done() { return player.p.points.gte(1e10) }
    }
    },
    microtabs:{
        tab:{
            "main":{
                name(){return '木屋买买买'}, // Name of tab button
                nameI18N(){return 'main'}, // Second name for internationalization (i18n) if internationalizationMod is enabled
                content:[
                    ['upgrade', 11],
                ],
            },
            "another":{
                name(){return '超市入口'},
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
		points: new Decimal(0),
    }},
    color: "#ff0000",
    requires: new Decimal(1e11), // Can be a function that takes requirement increases into account
    resource: "第一乘数", // Name of prestige currency
    resourceI18N: "第一乘数", // Second name of the resource for internationalization (i18n) if internationalizationMod is enabled
    baseResource: "金币", // Name of resource prestige is based on
    baseResourceI18N: "points", // Second name of the baseResource for internationalization (i18n) if internationalizationMod is enabled
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    upgrades: {
        11: {
            title: "MUL1",
            description: "金币获取乘以(第一乘数+1)",
            cost: new Decimal(10),
            effect() {
        return player[this.layer].points.add(1)
        }, // Calculate the effect of the upgrade. Can be a function that takes into account current game state.
         effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        12: {
            title: "今天你收歌了吗",
            description: "底力+1",
            return(){return true}
        },
    },
    
    microtabs:{
        tab:{
            "main":{
                name(){return '雷石东直放站'}, // Name of tab button
                nameI18N(){return 'main'}, // Second name for internationalization (i18n) if internationalizationMod is enabled
                content:[
                    ['upgrade', 11],
                ],
            },
            "another":{
                name(){return 'AT Lv.18'},
                nameI18N(){return 'another'},
                content:[
                    ['upgrade', 12],
                ],
            }
        },
    },
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       "main-display",
       "prestige-button",
       "blank",
       ["microtabs","tab"]
    ],
    layerShown(){if(hasMilestone('p', 1)) { return true } },
})
// You can delete the second name from each option if internationalizationMod is not enabled.
// You can use function i18n(text, otherText) to return text in two different languages. Typically, text is English and otherText is Chinese. If changedDefaultLanguage is true, its reversed