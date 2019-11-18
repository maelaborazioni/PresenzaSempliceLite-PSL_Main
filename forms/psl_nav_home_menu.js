	/**
 * @properties={typeid:24,uuid:"55195087-86ED-4338-90B0-0B113B97880F"}
 */
function getParentMenu()
{
	return forms.psl_nav_home;
}

/**
 * @param section
 *
 * @properties={typeid:24,uuid:"F214029E-DE54-4AD1-967F-CB03043E34D3"}
 */
function openSection(section)
{
	forms.psl_nav_main.gotoSection(section);
}

/**
 * @param jsForm
 * @param sezione
 *
 * @properties={typeid:24,uuid:"A0780972-0DEA-4C2B-A0A4-227CCF980F56"}
 */
function getMenuItemOnAction(jsForm, sezione)
{
	var method = jsForm.newMethod(
		"function onAction$" + sezione.nome + "(event){\
			openSection('" + sezione.nome + "');\
		 }");
	
	return method;
}