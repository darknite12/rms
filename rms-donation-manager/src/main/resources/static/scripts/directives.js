var app = angular.module('rmsdmgui.directives', []);

app.directive('dlEnterKey', function() {
	return function(scope, element, attrs) {
		element.bind('keydown keypress', function(event) {
			var keyCode = event.which || event.keyCode;
			
			if(keyCode === 13) {
				scope.$apply(function() {
					scope.$eval(attrs.dlEnterKey);
				});
				
				event.preventDefault();
			}
		});
	}
});