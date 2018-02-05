/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"D62CFFCF-CE1C-4633-AC97-2C51D20FB8BE"}
 */
var previousSection = '';

/**
 * @param event
 *
 * @properties={typeid:24,uuid:"FAC0F089-E5B9-47F9-A8DA-7FF0D0959224"}
 */
function onAction$btn_chiudi(event)
{
	chiudiStorico();
}

/**
 * @properties={typeid:24,uuid:"F057B303-95C8-457A-ADFE-962232B4B7CE"}
 */
function chiudiStorico()
{
	forms.psl_nav_main.gotoPreviousSection();
}
/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A73C7AF8-F5DE-4558-94DF-FDA0D42667C6"}
 */
function onLoad(event) 
{
	plugins.WebClientUtils.setExtraCssClass(elements.btn_chiudi, 'material-button material-button-flat');
}
