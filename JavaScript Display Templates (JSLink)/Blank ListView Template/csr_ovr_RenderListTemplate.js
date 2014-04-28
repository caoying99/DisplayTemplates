//Create our Namespace object to avoid polluting the global namespace
var pfh = pfh || {};

//Define our Header Render pattern
pfh.renderHeader = function(ctx) {
	//Define any header content here.
	//You can include JavaScript and CSS links here.
	var headerHTML = "<div>Header</div>";
	return headerHTML;
	}

//Define our footer render pattern
pfh.renderFooter = function(ctx) {
	//Define any footer content here.
	var footerHTML = "<div>Footer</div>";
	return footerHTML;
	}

//Define our item Render pattern
//This will be called once for each item being rendered from the list.
//All fields in the view can be access using ctx.CurrentItem.InternalFieldName
//NB: The field must be included in the view for it to be available
pfh.CustomItem = function(ctx) {
    var itemHTML = "<div>" + ctx.CurrentItem.Title + "</div>";
	return itemHTML;	
}

//Define any code/function that needs to be run AFTER the page has been completed and the DOM is complete.
pfh.PostRenderCallback = function(ctx) {
	alert("Callback");
}

//Define the function that will register our Override with SharePoint.
pfh.RegisterTemplateOverride = function () {
// 	Define a JavaScript object that will contain our Override
	var overrideCtx = {};
	overrideCtx.Templates = {};
	
//	Here we assign our Header and Footer functions to the template overrides.
	overrideCtx.Templates.Header = pfh.renderHeader;
	overrideCtx.Templates.Footer = pfh.renderFooter;

// 	And here we assign the CustomItem function to the Item registration.
	overrideCtx.Templates.Item = pfh.CustomItem;
	
//	And finally we add our PostRender function.
//  This expects a JavaScript array, so we pass the function in []
	overrideCtx.onPostRender = [pfh.PostRenderCallback(ctx)];
	
//	Register this Display Template against views with matching BaseViewID and ListTemplateType
//	See http://msdn.microsoft.com/en-us/library/microsoft.sharepoint.client.listtemplatetype(v=office.15).aspx for more ListTemplateTypes	
	overrideCtx.BaseViewID = 1;
	overrideCtx.ListTemplateType = 100;
	
//  Register the template overrides with SharePoint
	SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);
};

//Register for MDS enabled site otherwise the display template doesn't work on refresh
//Make sure the path here matches our JSLink
RegisterModuleInit("~sitecollection/_catalogs/masterpage/Display%20Templates/csr_ovr_RenderListTemplate.js", pfh.RegisterTemplateOverride); // CSR-override for MDS enabled site
pfh.RegisterTemplateOverride(); //CSR-override for MDS disabled site (because we need to call the entry point function in this case whereas it is not needed for anonymous functions)