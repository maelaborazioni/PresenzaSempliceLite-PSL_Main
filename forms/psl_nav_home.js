/**
 * @properties={typeid:24,uuid:"4BF96DF4-38D0-4C7A-8809-7C78CD669BF4"}
 */
function getName()
{
	return scopes.psl.Sezioni.HOME['nome'];
}

/**
 * @properties={typeid:24,uuid:"74E2C80F-5854-4615-BB18-7E3271AAA717"}
 */
function getSections()
{
	return forms.psl_nav_main.sections.filter(function(_){ return _.nome != getName(); });
}
