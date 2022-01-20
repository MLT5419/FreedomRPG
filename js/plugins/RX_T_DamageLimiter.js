//=============================================================================
// Plugin_Name : Damage Limiter
// File_Name   : RX_T_DamageLimiter.js
// Version     : 1.02
// Copylight   : 2020 TYPE74RX-T
//=============================================================================


//=============================================================================
/*:ja
 * @target MV MZ
 * @plugindesc It is possible to set a limit on the damage value given to your opponent.
 * @author TYPE74RX-T
 * @url https://w.atwiki.jp/type74rx-t/pages/221.html
 *
 * @param SystemWord in Notes1
 * @text System word 1
 * @desc System word to fill in the notes field
 * @default DamageLimiter
 *
 * @param SystemWord in Notes2
 * @text System word 2
 * @desc System word to fill in the notes field
 * @default DamageLimitPiercer
 *
 * @help Damage Limiter
 *
 * This plugin is compatible with RPG Maker MV and RPG Maker MZ.
 *
 * ◆Summary
 * It is possible to set a limit on the damage value given to your opponent.
 * For example, if you set the damage limiter to 1, you can only deal 1 point
 * of damage, no matter how powerful your attack is.
 * This can be set for actors, enemies, states, weapons and armors.
 * And you can also ignore these features to create skills and items
 * that do damage.
 *
 * ◆Usage
 * Fill in the note section.
 * Example: If you want to cap the damage dealt to 50
 * target of Effect: actors, enemies, states, weapons and armors
 *
 * <DamageLimiter:50>
 *
 * Setting to ignore damage limits(target of Effect: skills and item)
 *
 * <DamageLimitPiercer>
 *
 * [Spec]
 * For example, if an enemy has a damage limiter and more than one
 * limiting state applied, the minimum value of those states is the
 * limiter value.
 *
 * [Caution]
 * If the plug-ins "Absorbs damage", "Voids damage", and "Damage Reduction" are
 * implemented at the same time, their implementation priority is as follows.
 * 1st:"Absorbs damage"　2nd:"Voids damage"
 * 3rd:"Damage Reduction"　4th:This Plugin
 *
 * [Notes]
 * You don't need to worry about the plugin parameters.
 * It's just that the way you set up the notes field is different depending
 * on whether you are using the English or Japanese version.
 *
 * ◆License
 * This plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
*/
/*:
 * @target MV MZ
 * @plugindesc 伤害限制器 
 * @author TYPE74RX-T
 * @url https://mdc-light.jpn.org/TYPE74RX-T/
 *
 * @param SystemWord in Notes1
 * @text 系统字 1
 * @desc 系统字填写备注字段
 * @default 伤害限制
 *
 * @param SystemWord in Notes2
 * @text 系统字 2
 * @desc 系统字填写备注字段
 * @default 伤害极限穿透
 *
 * @help 伤害限制器
 *
 * 此插件兼容RPG Maker MV 和RPG Maker MZ。
 *
 * ◆概要
 * 您可以对造成的伤害应用限制器。
 * 例如，如果你将限制器设置为 1，那么无论你有多少攻击力，你都只能造成 1 点伤害。
 * 可以为角色、敌人、状态、武器和盔甲设置。
 * 您还可以通过忽略这些功能来创建造成伤害的技能和物品。 
 *
 * ◆使用方法
 * 备注输入。
 * 示例 1：如果您最多只能造成 50
 *（角色，敌人，状态，武器，盔甲） 
 *
 * <伤害限制:50>
 *
 * 例2:突破伤害上限时（技能、物品） 
 *
 * <伤害极限穿透>
 *
 * 【规格】
 * 例如，如果敌人角色有限制器设置并且应用了多个限制器状态，
 * 那么这些值的最小值将是限制器值。 
 *
 * 【请注意】
 * 如果插件“Damage Absorption”、“Damage Disable”和“Damage Mitigation”同时实现，
 * 则实现优先级如下。
 * 第一：“伤害吸收”　第二：“伤害无效”
 * 第三：“伤害减少　 第四：这个插件 
 *
 * 【备考】
 * 您不必担心插件参数。
 * 但是，备注栏的设置方法根据是日文版还是英文版而有所不同。 
 *
 * ◆执照
 * 这个插件是在 MIT 许可下发布的。
 * http://opensource.org/licenses/mit-license.php
*/
(() => {
    'use strict';

	//RX-T plugin parameters
	const parameters = PluginManager.parameters('RX_T_DamageLimiter');
	const rx_limitState = parameters['SystemWord in Notes1'];
	const rx_dmgLimitPiercer = parameters['SystemWord in Notes2'];

	//RX_T original process
	class RX_T {
		static getLimitDamage(target, value){
			const limTarget = target.isActor() ? target.actor() : target.enemy();
			let damageLimit = -1;
			let dmgLimits = [];
			let eqItem = 0;
			const equipSize = target.isActor() ? target.equips().length : 0;
			const equips = target.isActor() ? target.equips() : [];
			if (limTarget.meta[rx_limitState] !== undefined) dmgLimits.push(limTarget.meta[rx_limitState]);
		    damageLimit = -1;
		    target.states().forEach(function(state) {
		    	if(state.meta[rx_limitState] !== undefined) dmgLimits.push(state.meta[rx_limitState]);
		    }, target);
		    for (let i = 0; i < equipSize; i++){
		    	if (!target.isActor()) continue;
		    	if (equips[i] === null) continue;
		    	eqItem = i === 0 ? $dataWeapons[equips[i].id].meta[rx_limitState] : $dataArmors[equips[i].id].meta[rx_limitState];
		    	if(eqItem !== undefined) dmgLimits.push(eqItem);
		    }
		    if (dmgLimits.length > 0) damageLimit = Math.min.apply(null, dmgLimits);
			if (damageLimit > -1 && damageLimit < value) return $gameTemp._rx_byPotionLm ? -damageLimit : damageLimit;
			return $gameTemp._rx_byPotionLm ? -value : value;
		}
	}

	//Game_Action

	const rx_t_gaa200904_apply = Game_Action.prototype.apply;
	Game_Action.prototype.apply = function(target) {
	    target._rx_limitDmgPierce = this.item().meta[rx_dmgLimitPiercer] ? true : false;
	    rx_t_gaa200904_apply.call(this, target);
	};

	const rx_t_gae200904_executeDamage = Game_Action.prototype.executeDamage;
	Game_Action.prototype.executeDamage = function(target, value) {
		if (!target._rx_limitDmgPierce) value = RX_T.getLimitDamage(target, value);
		rx_t_gae200904_executeDamage.call(this, target, value);
	};

	const rx_t_gaierh2010013_itemEffectRecoverHp = Game_Action.prototype.itemEffectRecoverHp;
	Game_Action.prototype.itemEffectRecoverHp = function(target, effect) {
	    $gameTemp._rx_byPotionLm = true;
	    rx_t_gaierh2010013_itemEffectRecoverHp.call(this, target, effect);
	};

	//Game_Battler

	const rx_t_gbgh2010013_gainHp = Game_Battler.prototype.gainHp;
	Game_Battler.prototype.gainHp = function(value) {
		if (!this._rx_limitDmgPierce && value < 0 && $gameTemp._rx_byPotionLm) value = RX_T.getLimitDamage(this, -value);
		if ($gameTemp._rx_byPotionLm) $gameTemp._rx_byPotionLm = false;
		rx_t_gbgh2010013_gainHp.call(this, value);
	};

	//Scene_Title

	const rx_t_stc2010013_create = Scene_Title.prototype.create;
	Scene_Title.prototype.create = function() {
	    rx_t_stc2010013_create.call(this);
	    $gameTemp._rx_byPotionLm = false;
	};

	//Scene_Battle

	const rx_t_sbc2010013_create = Scene_Battle.prototype.create;
	Scene_Battle.prototype.create = function() {
	    rx_t_sbc2010013_create.call(this);
	    $gameTemp._rx_byPotionLm = false;
	};

})();