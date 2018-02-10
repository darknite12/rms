var app = angular.module('rmsdmgui.general.services', []);

app.service('PagerService', [function () {
	
	var createRange = function(start, end) {
		var numberRange = [];
		for(var i = start; i <= end; i++) {
			numberRange.push(i);
		}
		return numberRange;
	}
	
	this.createSlideRange = function(currentPage, totalPages) {
		var startPage, endPage;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if ((currentPage + 4) >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }
        return createRange(startPage, endPage);
	}
	
}]);