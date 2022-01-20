//=============================================================================
// Plugin_Name : スキルコスト拡張
// File_Name   : RX_T_MpTpCostEX.js
// Version     : 1.01
// Copylight   : 2015,2020 TYPE74RX-T
//=============================================================================


//=============================================================================
/*:ja
 * @target MV MZ
 * @plugindesc You will be able to set special skill costs.
 * @author TYPE74RX-T
 * @url https://w.atwiki.jp/type74rx-t/pages/221.html
 *
 * @param EnemyLevelSetuped
 * @text Enemy Lv reference method
 * @desc Enemy level reference system with
 * level-dependent skill cost
 * @type select
 * @default 0
 * @option Enemy's notes only
 * @value 0
 * @option Set a new param called "Lv" and see the notes field
 * @value 1
 * @option Lv is already set. See the notes field
 * @value 2
 * @option Set only the level
 * @value 3
 *
 * @param SystemWord in Notes1
 * @text System word
 * @desc System word to fill in the notes field
 * @default MpPctCost
 *
 * @param SystemWord in Notes2
 * @text System word
 * @desc System word to fill in the notes field
 * @default HpRestPctMpCost
 *
 * @param SystemWord in Notes3
 * @text System word
 * @desc System word to fill in the notes field
 * @default VarMpCost
 *
 * @param SystemWord in Notes4
 * @text System word
 * @desc System word to fill in the notes field
 * @default StepsMpCost
 *
 * @param SystemWord in Notes5
 * @text System word
 * @desc System word to fill in the notes field
 * @default LvPctMpCost
 *
 * @param SystemWord in Notes6
 * @text System word
 * @desc System word to fill in the notes field
 * @default TpRestPctMpCost
 *
 * @param SystemWord in Notes7
 * @text System word
 * @desc System word to fill in the notes field
 * @default VarTpCost
 *
 * @param SystemWord in Notes8
 * @text System word
 * @desc System word to fill in the notes field
 * @default StepsTpCost
 *
 * @param SystemWord in Notes9
 * @text System word
 * @desc System word to fill in the notes field
 * @default LvPctTpCost
 *
 * @param SystemWord in Notes10
 * @text System word
 * @desc System word to fill in the notes field
 * @default TPBGaugeCost
 *
 * @param SystemWord in Notes11
 * @text System word
 * @desc System word to fill in the notes field
 * @default Lv
 *
 * @help Skill Cost Type Expansion
 *
 * This plugin is compatible with RPG Maker MV and RPG Maker MZ.
 *
 * ◆Summary
 * You will be able to set special skill costs.
 *
 * ◆Usage
 * 【Configuring Plug-in Parameters】
 * ★Enemy Lv reference method
 * This is basically the only thing you need to set in the plugin parameters.
 * You don't need to care about the other parameters unless you are willing to
 * set them yourself.
 *
 * ・Enemy's notes only
 * If the level setting described below is in the notes field, the level only
 * refers to the notes field.
 * If you don't set the level parameters in another plugin or if you don't set
 * the level parameters by yourself, etc., please keep the settings as
 * they are, i.e., leave them in the default state.
 *
 * ・Set a new param called "Lv" and see the notes field
 * If the level setting described below is in a notes field, the level refers
 * to the notes field, but a new parameter called "level" is set for the enemy.
 * This means that you can also use ".level" in the damage calculation formula
 * for skills used only by enemy characters in the database.
 *
 * ・Lv is already set. See the Notes field
 * The function is almost the same as "Set a new param called "Lv" and see the
 * notes field" above, but this one is only for those who have already set the
 * level parameters by another plugin or their own work.
 * When you select this option, please place this plugin below the relevant
 * plugin.
 *
 * ・Set only the level
 * It allows you to set only the level without applying the original
 * functionality of this plugin.
 * This means that in the database, ".level" can be used in the damage
 * calculation formula for skills used only by enemies, that's all.
 *
 * 【Database Settings】
 * Describe everything in the notes section.
 *
 * <MpPctCost>
 * The set MP cost is a percentage of the user's maximum MP, and if it is set
 * to 100, the user consumes MP for the maximum MP value.
 *
 * <HpRestPctMpCost> or <TpRestPctMpCos>
 * The percentage of HP remaining is a percentage of the user's maximum MP/TP.
 * According to the specifications of this plugin, the less HP left, the less
 * the MP/TP cost will be, and when the HP is full, the MP/TP cost will be
 * equal to the maximum value of MP/TP.
 * 
 * <VarMpCost:n> or <VarTpCost:n>
 * The value you set for the n-th game variable is the MP/TP cost.
 * You can create skills that allow you to fluctuate your MP/TP cost in events.
 * However, the TP cost is limited to a maximum of 100.
 *
 * <StepsMpCost> or <StepsTpCost>
 * The MP/TP cost will be the "number of steps" divided by the "set MP/TP
 * cost".
 * However, if you want your enemies to use it, it will remain at the MP/TP
 * you set, as it has no concept of steps.
 * Also, due to the specifications calculated by the above formula, if you set
 * the MP/TP cost to 0, the cost of that skill will be zero.
 * This is to prevent the number of steps from being divided by 0.
 * However, the TP cost is limited to a maximum of 100.
 * 
 * <LvPctMpCost> or <LvPctTpCost>
 * The MP/TP cost is calculated by multiplying the User's Level by the
 * MP/TP cost you set.
 * If you do not have an enemy's level set, the MP/TP consumption of an enemy
 * will be 0 when used.
 * However, the TP cost is limited to a maximum of 100.
 *
 * <Lv:n>
 * Sets the level of the enemy.
 * If you don't have a level-dependent consumption-based skill set, you don't
 * need to set it.
 * 
 * <TPBGaugeCost:n>
 * This setting is for MZ's TPB mode only. It can also be applied to items.
 * The value of n is a percentage. This consumes a set percentage.
 * The less this value is, the less time it takes for the next turn to arrive.
 *
 * ◆License
 * This plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
*/
/*:
 * @target MV MZ
 * @plugindesc 技能消耗扩展。
 * @author TYPE74RX-T
 * @url https://mdc-light.jpn.org/TYPE74RX-T/
 *
 * @param EnemyLevelSetuped
 * @text 参考敌方角色等级
 * @desc 与等级相关的技能消耗
 * 如何参考敌方角色等级
 * @type select
 * @default 0
 * @option 只参考敌方角色的备注栏
 * @value 0
 * @option 设置等级并参考备注字段
 * @value 1
 * @option 等级已设置 ・请参阅备注栏
 * @value 2
 * @option 仅设置等级。请参阅备注字段。
 * @value 3
 *
 * @param SystemWord in Notes1
 * @text 系统字 1
 * @desc 系统字填写备注字段
 * @default MP割合消費
 *
 * @param SystemWord in Notes2
 * @text 系统字 2
 * @desc 系统字填写备注字段
 * @default MPHP残量割合消費
 *
 * @param SystemWord in Notes3
 * @text 系统字 3
 * @desc 系统字填写备注字段
 * @default MP変数消費
 *
 * @param SystemWord in Notes4
 * @text 系统字 4
 * @desc 系统字填写备注字段
 * @default MP歩数消費
 *
 * @param SystemWord in Notes5
 * @text 系统字 5
 * @desc 系统字填写备注字段
 * @default MPLV依存消費
 *
 * @param SystemWord in Notes6
 * @text 系统字
 * @desc 系统字填写备注字段
 * @default TPHP残量割合消費
 *
 * @param SystemWord in Notes7
 * @text 系统字 7
 * @desc 系统字填写备注字段
 * @default TP変数消費
 *
 * @param SystemWord in Notes8
 * @text 系统字 8
 * @desc 系统字填写备注字段
 * @default TP歩数消費
 *
 * @param SystemWord in Notes9
 * @text 系统字 9
 * @desc 系统字填写备注字段
 * @default TPLV依存消費
 *
 * @param SystemWord in Notes10
 * @text 系统字 10
 * @desc 系统字填写备注字段
 * @default 消費TPB
 *
 * @param SystemWord in Notes11
 * @text 系统字 11
 * @desc 系统字填写备注字段
 * @default Lv
 *
 * @help 技能消耗扩展
 *
 * 此插件兼容RPG Maker MV 和RPG Maker MZ。
 *
 * ◆概要
 * 您将能够设置特殊技能成本。
 *
 * ◆使用方法
 * 【设置插件参数】
 * ★参考敌方角色等级
 * 这基本上是您需要在插件参数中设置的唯一地方。
 * 除非您想自己设置，否则您不必担心其他参数。 
 *
 * ・只参考敌方角色的备注栏
 * 如果在备注字段中设置了稍后描述的等级设置，
 * 则等级仅指备注字段。
 * 如果您没有通过其他插件或自己设置等级参数，
 * 则设置为默认值，请保持此状态。 
 *
 * ・设置等级并参考备注字段 
 * 如果在备注字段中设置了稍后描述的等级设置，
 * 则等级将参考备注字段，但等级将重新设置为敌人角色的参数。
 * 也就是说，数据库中只有敌方角色使用的技能的伤害计算公式中可以使用「.level」 
 *
 * ・等级已设置 ・请参阅备注栏
 * 功能与上面的「设置等级并参考备注字段」基本相同，
 * 但此设置仅适用于已通过其他插件或自制设置等级参数的用户。
 * 请将此插件放置在相应插件下方后选择此项。
 *
 * ・仅设置等级
 * 不应用本插件原有功能，只能设置等级。
 * 也就是说，数据库中只有敌方角色使用的技能伤害计算公式中
 * 只允许使用「.level」的功能。
 *
 * 【数据库设置】
 * 在备忘录字段中写下所有内容。
 *
 * <MP割合消費>
 * MP 被最大 MP 的设定 MP% 消耗。
 *
 * <MPHP残量割合消費>　或者　<MPHP残量割合消費>
 * MP/TP消耗量由剩余HP量的比例决定。
 * 根据本插件的规格，剩余HP越少，消耗的MP/TP越少。 
 * 
 * <MP変数消費:n>　或者　<TP変数消費:n>
 * 消耗的 MP / TP 将是为第 n 个变量设置的数字。
 * 您可以创建技能来自由更改活动中消耗的MP / TP（※）。
 *
 * <MP歩数消費>　或者　<TP歩数消費>
 * MP / TP 消耗将是“步数 / MP / TP 消耗数”（※）。
 * 如果您想对敌方角色使用它，由于没有步数的概念，
 * 因此消耗的 MP / TP 将保持原样。
 * 另外，由于以上公式计算的规格，如果TP / MP消耗设置为0，
 * 则不会被0除，因此该技能的消耗将为0。 
 * 
 * <MPLV依存消費>　或者　<TPLV依存消費>
 * MP / TP消耗将是“用户等级x MP / TP消耗数”（※）。
 * 如果不设置敌方角色等级，敌方角色使用时消耗的MP/TP为0。 
 *
 * ※：最大TP消耗为100。 
 *
 * <Lv:n>
 * 设置敌方角色的等级。
 * 如果没有设置依赖LV的消耗技能，则不需要设置。 
 * 
 * <消費TPB:n>
 * 这是仅适用于 MZ TPB 模式的设置。 它也可以应用于物品。
 * n 的值是一个百分比。 仅消耗设定的百分比。
 * 数字越小，到下一回合的时间越短。 
 *
 * ◆执照 
 * 这个插件是在 MIT 许可下发布的。 
 * http://opensource.org/licenses/mit-license.php
*/
(() => {
    'use strict';

    //RX-T original function

    const rx_MTC = PluginManager.parameters('RX_T_MpTpCostEX');
    const rx_parELSU = parseInt(rx_MTC['EnemyLevelSetuped']);
    const rx_MpPctCost = rx_MTC['SystemWord in Notes1']; //MpPctCost
    const rx_HpRestMPCost = rx_MTC['SystemWord in Notes2']; //HpRestPctMpCost
    const rx_VarMPCost = rx_MTC['SystemWord in Notes3']; //VarMpCost
    const rx_StepMPCost = rx_MTC['SystemWord in Notes4']; //StepsMpCost
    const rx_LvPctMPCost = rx_MTC['SystemWord in Notes5']; //LvPctMpCost
    const rx_HpRestTPCost = rx_MTC['SystemWord in Notes6']; //TpRestPctMpCost
    const rx_VarTPCost = rx_MTC['SystemWord in Notes7']; //VarTpCost
    const rx_StepTPCost = rx_MTC['SystemWord in Notes8']; //StepsTpCost
    const rx_LvPctTPCost = rx_MTC['SystemWord in Notes9']; //LvPctTpCost
    const rx_TPBGaugeCost = rx_MTC['SystemWord in Notes10']; //TPBGaugeCost
    const rx_lvForCost = rx_MTC['SystemWord in Notes11']; //Lv

    if (rx_parELSU !== 3){

	//Game_BattlerBase

    Game_BattlerBase.prototype.rx_mpCostLevelResult = function(skill) {
        if (rx_parELSU > 0) {
            return this.level * skill.mpCost;
        } else if (this.isActor()){
            return this.level * skill.mpCost;
        } else {
            let lv = this._enemies[i].enemy().meta[rx_lvForCost];
            if (lv === undefined) lv = 0;
            return lv * skill.mpCost;
        }
    };

    Game_BattlerBase.prototype.rx_tpCostLevelResult = function(skill) {
        let rx_tpCost = 0;
        if (rx_parELSU > 0) {
            rx_tpCost = this.level * skill.tpCost;
        } else if (this.isActor()){
            rx_tpCost = this.level * skill.tpCost;
        } else {
            let lv = this._enemies[i].enemy().meta[rx_lvForCost];
            if (lv === undefined) lv = 0;
            rx_tpCost = lv * skill.tpCost;
        }
        if (rx_tpCost > 100) rx_tpCost = 100;
        return rx_tpCost;
    };

    const rx_t_gbbpsmc151119_skillMpCost = Game_BattlerBase.prototype.skillMpCost;
    Game_BattlerBase.prototype.skillMpCost = function(skill) {
        let rx_cost = 0, rx_varNo = 0;
        if (skill.meta[rx_MpPctCost]) {
            rx_cost = skill.mpCost * this.mmp / 100 | 0;
            return Math.floor(rx_cost * this.mcr);
        }
        if (skill.meta[rx_HpRestMPCost]) {
            rx_cost = this.hp / this.mhp;
            rx_cost = rx_cost * this.mmp;
            return Math.floor(rx_cost * this.mcr);
        }
        if (skill.meta[rx_VarMPCost]) {
            rx_varNo = skill.meta[rx_VarMPCost];
            rx_cost = $gameVariables.value(rx_varNo);
            return Math.floor(rx_cost * this.mcr);
        }
        if (skill.meta[rx_StepMPCost]) {
            if (this.isActor()) {
                rx_cost = skill.mpCost === 0 ? 0 : Math.floor($gameParty.steps() / skill.mpCost);
            } else {
                rx_cost = skill.mpCost;
            }
            return Math.floor(rx_cost * this.mcr);
        }
        if (skill.meta[rx_LvPctMPCost]) {
            rx_cost = this.rx_mpCostLevelResult(skill);
            return Math.floor(rx_cost * this.mcr);
        }
        return rx_t_gbbpsmc151119_skillMpCost.call(this, skill);
    };

    const rx_t_gbbpstc151119_skillTpCost = Game_BattlerBase.prototype.skillTpCost;
    Game_BattlerBase.prototype.skillTpCost = function(skill) {
        let rx_cost = 0, rx_varNo = 0;
        if (skill.meta[rx_HpRestTPCost]) {
            rx_cost = this.hp / this.mhp;
            return Math.floor(rx_cost * 100);
        }
        if (skill.meta[rx_VarTPCost]) {
            rx_varNo = skill.meta[rx_VarTPCost];
            rx_cost = $gameVariables.value(rx_varNo);
            return rx_cost > 100 ? 100 : rx_cost;
        }
        if (skill.meta[rx_StepTPCost]) {
            if (this.isActor()) {
                rx_cost = skill.tpCost === 0 ? 0 : Math.floor($gameParty.steps() / skill.tpCost);
            } else {
                rx_cost = skill.tpCost;
            }
            return rx_cost > 100 ? 100 : rx_cost;
        }
        if (skill.metarx_LvPctTPCost) {
            rx_cost = this.rx_tpCostLevelResult(skill);
            return rx_cost > 100 ? 100 : rx_cost;
        }
        return rx_t_gbbpstc151119_skillTpCost.call(this, skill);
    };

    //Game_Troop　レベルを設定する場合

    const rx_t_gts2009101_setup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function(troopId) {
        rx_t_gts2009101_setup.call(this, troopId);
        if (rx_parELSU === 1) {
            for (let i = 0; i <this._enemies.length; i++){
                const lvll = parseInt(this._enemies[i].enemy().meta[rx_lvForCost]);
                this._enemies[i].level = lvll === undefined ? 0 : lvll;
            }
        }
    };

    //for MZ
    if (PluginManager._commands !== undefined) {

        //Game_Battler

        const rx_t_gbctct200910_clearTpbChargeTime = Game_Battler.prototype.clearTpbChargeTime;
        Game_Battler.prototype.clearTpbChargeTime = function() {
            rx_t_gbctct200910_clearTpbChargeTime.call(this);
            this._tpbChargeTime = $gameTemp.rx_restTPBCharge;
        };

        const rx_t_gbui200910_useItem = Game_Battler.prototype.useItem;
        Game_Battler.prototype.useItem = function(item) {
            rx_t_gbui200910_useItem.call(this, item);
            $gameTemp.rx_restTPBCharge = 0;
            if (item.meta[rx_TPBGaugeCost] !== undefined) $gameTemp.rx_restTPBCharge = (100 - item.meta[rx_TPBGaugeCost]) / 100;
        };

    }

    } else {
    
    //Game_Troop　レベルだけを設定する場合

    const rx_t_gts2009102_setup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function(troopId) {
        rx_t_gts2009102_setup.call(this, troopId);
        if (rx_parELSU === 3) {
            for (let i = 0; i <this._enemies.length; i++){
                const lvll = parseInt(this._enemies[i].enemy().meta[rx_lvForCost]);
                this._enemies[i].level = lvll === undefined ? 0 : lvll;
            }
        }
    };

    }

})();