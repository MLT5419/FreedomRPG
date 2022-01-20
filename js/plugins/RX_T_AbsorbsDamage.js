//=============================================================================
// Plugin_Name : Absorbs damage
// File_Name   : RX_T_AbsorbsDamage.js
// Version     : 1.11
// Copylight   : 2020 TYPE74RX-T
//=============================================================================


//=============================================================================
/*:ja
 * @target MV MZ
 * @plugindesc Absorbs damage below a specified value(actors & enemies).
 * @author TYPE74RX-T
 * @url https://w.atwiki.jp/type74rx-t/pages/221.html
 *
 * @param SystemWord in Notes
 * @text System Word 1
 * @desc The system word to fill in the notes section
 * @default AbsorbsLessDamage
 *
 * @param SystemWord in Notes2
 * @text System Word 2
 * @desc The system word to fill in the notes section
 * @default AbsorbsMoreDamage
 *
 * @param SystemWord in Notes3
 * @text System word 3
 * @desc The system word to fill in the notes section
 * @default DisableDamageAbsorption
 *
 * @param absorbMsgTypeActor
 * @text AbsorbMSGType:Actor
 * @desc How the message is displayed when damage is absorbed
 * @type select
 * @option Configured in the plugin parameters
 * @value plugin
 * @option "Actor Recovery" in the "Terms" section of the Database
 * @value heal
 * @default plugin
 *
 * @param absorbMsgActor
 * @parent absorbMsgTypeActor
 * @text The text when absorbs
 * @desc Text to be displayed when damage is absorbed
 * %1 is replaced to battler's name, %2 is damage numeric
 * @type string
 * @default %1 has absorbed %2 damage!
 *
 * @param absorbMsgTypeEnemy
 * @text AbsorbMSGType:Enemy
 * @desc How the message is displayed when damage is absorbed
 * @type select
 * @option Configured in the plugin parameters
 * @value plugin
 * @option "Enemy Recovery" in the "Terms" section of the Database
 * @value heal
 * @default plugin
 *
 * @param absorbMsgEnemy
 * @parent absorbMsgTypeEnemy
 * @text The text when absorbs
 * @desc Text to be displayed when damage is absorbed
 * %1 is replaced to battler's name, %2 is damage numeric.
 * @type string
 * @default %1 has absorbed %2 damage!
 *
 * @param AbsorbRule
 * @text Absorption rule
 * @desc In the event of a combination of damage absorption conditions, the process
 * @type select
 * @option Total
 * @value total
 * @option Max
 * @value max
 * @option Min
 * @value min
 * @default max
 *
 * @help Absorbs damage
 * 
 * This plugin is compatible with RPG Maker MV and RPG Maker MZ.
 *
 * ◆Summary
 * You will be able to create enemies, actors, states, weapons, and armors
 * that absorb more, or less, than a certain amount of damage.
 * Skills with this effect can also be practically created, because
 * it can set to state.
 *
 * And you can also ignore these features to create skills and items
 * that do damage.
 *
 * ◆Usage
 * Fill in the notes section.
 * (target of Effect: enemies, actors, states, weapons and armors).
 *
 * For example:Absorbs damage of 50 or less.
 * <AbsorbsLessDamage:50>
 *
 * For example:Absorbs damage of 50 or more.
 * <AbsorbsMoreDamage:50>
 *
 * Settings for disabling damage absorption(skills, items)
 * <DisableDamageAbsorption>
 *
 * [About Plugin Parameters]
 * You don't need to worry about the system word.
 * It's just that the way you set up the notes field is different depending
 * on whether you are using the English or Japanese version.
 *
 * ★AbsorbMSGType:Actor(or Enemy)
 * -Configured in the plugin parameters(param:plugin)
 *  The content of "The text when absorbs" described below is applied.
 * -"Friendly Recovery" in the "Terms" section of the Database(param:heal)
 *  Apply the content of "Friendly Recovery" in "Terms" under "Database".
 *
 * ★The text when absorbs
 * You can set the text you want to appear in the Battle Log when the
 * damage is absorbed.
 * Be sure to include "%1" and "%2" in the text.
 *
 * ★absorption rule
 * Sets how damage absorption conditions are handled when they overlap.
 * On the actor's side, it is determined using the values set for things like
 * the actor, the state it is receiving, the weapon it is equipped with, and
 * the armor it is equipped with.
 * This is referred to as Group A.
 * On the enemy's side, it is determined using the values set for the enemy,
 * and the values set for the state it is receiving.
 * This is referred to as Group B.
 *
 * -Total
 *  The specified amount of damage absorbed is the sum of the groups A/B.
 *
 * -Max
 *  The prescribed amount of damage absorbed is the maximum amount of value in
 *  groups A/B.
 *
 * -Min
 *  The prescribed amount of damage absorbed is the minimum amount of value in
 *  groups A/B.
 *
 * ◆License
 * This plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
*/
/*:
 * @target MV MZ
 * @plugindesc 创建在指定数量内（或超过）吸收伤害的敌人和角色。 
 * @author TYPE74RX-T
 * @url https://mdc-light.jpn.org/TYPE74RX-T/
 *
 * @param SystemWord in Notes
 * @text 系统字1
 * @desc 系统字填写备注字段 
 * @default 指定値内ダメージ吸収

 * @param SystemWord in Notes2
 * @text 系统字2
 * @desc 系统字填写备注字段 
 * @default 指定値以上ダメージ吸収
 *
 * @param SystemWord in Notes3
 * @text 系统字3
 * @desc 系统字填写备注字段 
 * @default ダメージ吸収無効
 *
 * @param absorbMsgTypeActor
 * @text 吸收时的信息类型：队友
 * @desc 设置吸收伤害时显示信息的位置
 * @type select
 * @option 直接通过参数设置
 * @value plugin
 * @option 数据库中的[我方恢复] 
 * @value heal
 * @default plugin
 *
 * @param absorbMsgActor
 * @parent absorbMsgTypeActor
 * @text 吸收伤害时表示的文字
 * @desc 吸收伤害时显示的文字
 * %1 替换为 目标 名称，%2 替换为伤害值 
 * @type string
 * @default %1吸收了%2的伤害！
 *
 * @param absorbMsgTypeEnemy
 * @text 吸收信息类型：敌人
 * @desc 设置吸收伤害时显示信息的位置
 * @type select
 * @option 直接通过参数设置
 * @value plugin
 * @option 数据库中的[敌人恢复] 
 * @value heal
 * @default plugin
 *
 * @param absorbMsgEnemy
 * @parent absorbMsgTypeEnemy
 * @text 吸收伤害时表示的文字
 * @desc 吸收伤害时显示的文字
 * %1 替换为 目标 名称，%2 替换为伤害值 
 * @type string
 * @default %1吸收了%2的伤害！ 
 *
 * @param AbsorbRule
 * @text 吸收规则
 * @desc 伤害吸收条件重叠时的处理
 * @type select
 * @option 总和
 * @value total
 * @option 最大值
 * @value max
 * @option 最小值
 * @value min
 * @default max
 *
 * @help 吸收伤害
 *
 * 此插件兼容RPG Maker MV 和RPG Maker MZ。 
 *
 * ◆概要
 * 吸收超过指定范围（或更多）伤害的敌方、角色
 * 您将能够创建状态、武器和盔甲。
 * 由于它可以设置为状态，因此您实际上可以创建具有此效果的技能。 
 * 
 * 您还可以通过忽略这些特征来创建造成伤害的技能和物品。 
 *
 * ◆使用方法
 * 填写角色、敌人、状态、武器和盔甲的备注字段。
 *
 * 例1：50点内吸收伤害的格式
 * <指定値内ダメージ吸収:50>
 *
 * 例2：吸收 50 点或更多伤害的格式
 * <指定値以上ダメージ吸収:50>
 *
 * 禁用伤害吸收时（技能、物品）
 * <ダメージ吸収無効>
 *
 * 【关于插件参数】
 * 系统字不需要设置。
 *
 * ★吸收时的信息类型：队友（或敌人） 
 * ・直接通过参数设置（値：plugin）
 *  将反映稍后描述的“吸收时的显示文本”的内容。 
 * ・数据库中的“我方恢复”（値：heal）
 *  「数据库」的「用语」它在「我方回复」的内容里反馈。
 *
 * ★吸收时表示文
 * 当伤害被吸收时，你可以设置你想要在战斗日志中显示的文本。
 * 请务必将内容设置为包含“%1”和“%2”。
 *
 * ★吸收规则
 * 决定当伤害吸收条件重叠时该怎么做。
 * 对于角色，使用为角色设置的值，他们被附加的状态，
 * 他们装备的武器和盔甲。 简称A组。
 * 在敌方的情况下，使用为敌方设置的值和被附加状态来决定。
 * 简称B组。 
 *
 * ・总和
 * 指定的伤害吸收量为A组/B组之和。
 *
 * ・最大値（默认配置）
 * 指定的伤害吸收量为A组/B组中的最大值。 
 *
 * ・最小値（默认配置）
 * 指定的吸收伤害量是A组/B组中的最小值。 
 *
 * ◆ライセンス
 * 这个插件是在 MIT 许可下发布的。
 * http://opensource.org/licenses/mit-license.php
*/

(() => {
    'use strict';

	//RX-T plugin parameters
	const parameters = PluginManager.parameters('RX_T_AbsorbsDamage');
	const absorbWord = parameters['SystemWord in Notes'];
	const OVDMabsorbWord = parameters['SystemWord in Notes2'];
	const disabsorbWord = parameters['SystemWord in Notes3'];
	const absorbMsgTypeActor = parameters['absorbMsgTypeActor'] || 'plugin'
	const absorbMsgActor = (parameters['absorbMsgActor'] || "%1 has absorbed %2 damage!");
	const absorbMsgTypeEnemy = parameters['absorbMsgTypeEnemy'] || 'plugin'
	const absorbMsgEnemy = (parameters['absorbMsgEnemy'] || "%1 has absorbed %2 damage!");
	const absorbRule = parameters['AbsorbRule'];

	//RX_T original process
	class RX_T {
		static getAbsVar(object, option, valuetype = "") {
			if (object === undefined) return undefined;
			if (option === 0) {
				const value = valuetype === "int" ? parseInt(object.meta[absorbWord]) : object.meta[absorbWord];
				return value;
			}
			if (option === 1) {
				const value = valuetype === "int" ? parseInt(object.meta[OVDMabsorbWord]) : object.meta[OVDMabsorbWord];
				return value;
			}
		}
		static absorbDamageCalc(target, option){
			let rx_target = target.isActor() ? target.actor() : target.enemy();
			let rx_maxMinValue = [];
			let rx_totalValue = 0;
			let rx_eqItem = 0;
			const rx_equipSize = target.isActor() ? target.equips().length : 0;
			const rx_equips = target.isActor() ? target.equips() : [];
			if (absorbRule !== "total" && this.getAbsVar(rx_target, option) !== undefined) rx_maxMinValue.push(this.getAbsVar(rx_target, option));
			if (absorbRule === "total" && this.getAbsVar(rx_target, option) !== undefined) rx_totalValue += this.getAbsVar(rx_target, option, "int");
		    target.states().forEach(function(state) {
		    	if(absorbRule !== "total" && RX_T.getAbsVar(state, option) !== undefined) rx_maxMinValue.push(RX_T.getAbsVar(state, option));
		    	if(absorbRule === "total" && RX_T.getAbsVar(state, option) !== undefined) rx_totalValue += RX_T.getAbsVar(state, option, "int");
		    }, target);
		    for (let i = 0; i < rx_equipSize; i++){
		    	if (!target.isActor()) continue;
		    	if (rx_equips[i] === null) continue;
		    	rx_eqItem = i === 0 ? RX_T.getAbsVar($dataWeapons[rx_equips[i].id], option) : RX_T.getAbsVar($dataArmors[rx_equips[i].id], option);
		    	if(absorbRule !== "total" && rx_eqItem !== undefined) rx_maxMinValue.push(rx_eqItem);
		    	if(absorbRule === "total" && rx_eqItem !== undefined) rx_totalValue += parseInt(rx_eqItem);
		    }
			if (absorbRule === "max") return rx_maxMinValue.length < 1 ? -1 : Math.max.apply(null, rx_maxMinValue);
			if (absorbRule === "min") return rx_maxMinValue.length < 1 ? -1 : Math.min.apply(null, rx_maxMinValue);
			return rx_totalValue === 0 ? -1 : rx_totalValue;
		}
		static getAbsCalc(target, value, or_less, or_more) {
			target._rx_hpAbsorb = 0;
			if (or_less || or_more) {
				value *= -1;
				if (target.isActor() && absorbMsgTypeActor === "plugin") target._rx_hpAbsorb = value;
				if (!target.isActor() && absorbMsgTypeEnemy === "plugin") target._rx_hpAbsorb = value;
				if (target._rx_disableAbsorb){
					value *= -1;
					target._rx_hpAbsorb = 0;
					target._rx_disableAbsorb = false
				}
			}
			return $gameTemp._rx_byPotionAb ? -value : value;
		}
		static absorbLastValue(target, value){
			const minusDamage = this.absorbDamageCalc(target, 0);
			const ovDamage = this.absorbDamageCalc(target, 1);
			const or_lessDamageAb = (value > 0 && minusDamage > 0 && value <= minusDamage);
			const or_moreDamageAb = (value > 0 && ovDamage > 0 && value >= ovDamage);
			return this.getAbsCalc(target, value, or_lessDamageAb, or_moreDamageAb);
		}
		static makeHpAbsorbText(target) {
			const result = target.result();
		    const damage = result.hpDamage;
		    const isActor = target.isActor();
		    let fmt;
	        fmt = isActor ? absorbMsgActor : absorbMsgEnemy;
			target._rx_hpAbsorb = 0;
	        return fmt.format(target.name(), -damage);
		}
	}

	//Game_Action

	const rx_t_gae2008201_apply = Game_Action.prototype.apply;
	Game_Action.prototype.apply = function(target) {
	    target._rx_disableAbsorb = this.item().meta[disabsorbWord] ? true : false;
	    rx_t_gae2008201_apply.call(this, target);
	};

	const rx_t_gae151101_executeDamage = Game_Action.prototype.executeDamage;
	Game_Action.prototype.executeDamage = function(target, value) {
		value = RX_T.absorbLastValue(target, value);
		rx_t_gae151101_executeDamage.call(this, target, value);
	};

	const rx_t_gaierh2010011_itemEffectRecoverHp = Game_Action.prototype.itemEffectRecoverHp;
	Game_Action.prototype.itemEffectRecoverHp = function(target, effect) {
	    $gameTemp._rx_byPotionAb = true;
	    rx_t_gaierh2010011_itemEffectRecoverHp.call(this, target, effect);
	};

	//Game_Battler

	const rx_t_gbgh2010011_gainHp = Game_Battler.prototype.gainHp;
	Game_Battler.prototype.gainHp = function(value) {
		if (!this._rx_disableAbsorb && value < 0 && $gameTemp._rx_byPotionAb) value = RX_T.absorbLastValue(this, -value);
		if ($gameTemp._rx_byPotionAb) $gameTemp._rx_byPotionAb = false;
		rx_t_gbgh2010011_gainHp.call(this, value);
	};

	//Scene_Title

	const rx_t_stc2010011_create = Scene_Title.prototype.create;
	Scene_Title.prototype.create = function() {
	    rx_t_stc2010011_create.call(this);
	    $gameTemp._rx_byPotionAb = false;
	};

	//Scene_Battle

	const rx_t_sbc2010011_create = Scene_Battle.prototype.create;
	Scene_Battle.prototype.create = function() {
	    rx_t_sbc2010011_create.call(this);
	    $gameTemp._rx_byPotionAb = false;
	};

	//Window_BattleLog

	const rx_t_gae2008201_makeHpDamageText = Window_BattleLog.prototype.makeHpDamageText;
	Window_BattleLog.prototype.makeHpDamageText = function(target) {
		if (target._rx_hpAbsorb < 0) return RX_T.makeHpAbsorbText(target);
	    return rx_t_gae2008201_makeHpDamageText.call(this, target);
	};

})();