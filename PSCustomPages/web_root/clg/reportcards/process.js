function processReports(portal) {
	$j('div.container').each(function(){
		var reportPage = 'reportCardData.html?action=',
			rpt = $j(this),
			sid = +(rpt.data('sid')), 
			yid = +(rpt.data('yid')), 
			sc = rpt.data('sc'), 
			gr = +(rpt.data('gr'));
		
		if (portal == 'admin') { reportPage = '/admin/reports/CRB/grading/' + reportPage; }
		if (portal == 'teachers') { reportPage = '/teachers/reportCards/' + reportPage; }
		
		if (( rpt.hasClass('trc') )||( rpt.hasClass('src') )){
			rpt.show();
		} else {
			rpt.html( '<div class="center">No Report Cards for this student</div>' );
		}
		
		if (rpt.hasClass('trc')) {
		    var gtbl = rpt.find('table.gradestable'),
		    	atbl = rpt.find('table.attTbl'),
		    	schoolPhone = rpt.find('span.schoolPhone').text();
		    
		    rpt.find('table.headerTbl td.schYr').text( (1990+yid)+'-'+(1991+yid) );
		    rpt.find('table.headerTbl td.hr').text( rpt.find('div.hr').text() );
		    
		    if ( gr < 9 ) {
		        gtbl.find('.lvl,.t4,.x1,.x2,.s1,.s2').remove();
		        gtbl.find('thead th.t1').text('Term 1 Grade');
		        gtbl.find('thead th.t2').text('Term 2 Grade');
		        gtbl.find('thead th.t3').text('Term 3 Grade');
		        gtbl.find('col.t1,col.t2,col.t3,col.y1').addClass('msgrade');
		        atbl.find('.t4').remove();
		    } else {
		        $j(this).find('.honorRollCell').remove();
		        gtbl.find('col.t1,col.t2,col.t3,col.t4,col.x1,col.x2,col.s1,col.s2,col.y1,col.lvl').addClass('hsgrade');
		    }
		} else {
		    var stan2grade = rpt.find('table.stan2grade'),
		    	tempStanGrades = rpt.find('table.tempStanGrades'),
		    	tempStanComments = rpt.find('table.tempStanComments'),
		    	excludefromreport = 0,
		    	rowCount = 0, p1limit = 27, p2limit = 40,
		    	curSecDCID = '', curEndDate = '',
		    	curCrsNum = '', curCrsName = '', curSC = '', curGrade = '',
		    	curTblStandardID = 0, lastTblStandardID = 0,
		    	curStandardID = 0, curHeadStandardID = 0, curSubHead1StandardID = 0, curSubHead2StandardID = 0, 
		    	lastStandardID = 0, lastHeadStandardID = 0, lastSubHead1StandardID = 0, lastSubHead2StandardID = 0,
		    	curStanName = '', curHeadStanName = '', curSubHead1StanName = '', curSubHead2StanName = '',
		    	curStanDesc = '', curHeadStanDesc = '', curSubHead1StanDesc = '', curSubHead2StanDesc = '',
		    	curStanID = '', curHeadStanID = '', curSubHead1StanID = '', curSubHead2StanID = '',
		    	curStanSub = '', curHeadStanSub = '', curSubHead1StanSub = '', curSubHead2StanSub = '',
		    	curStanGraded = '', curHeadStanGraded = '', curSubHead1StanGraded = '', curSubHead2StanGraded = '',
		    	curStanComment = '', curHeadStanComment = '', curSubHead1StanComment = '', curSubHead2StanComment = '',
		    	curTbl, curRow, curCell, newTbl;
		    
		    //Do things that pertain to all report cards first
		    $j('.schoolLogo,.distLogo').load(function(){
		        //Image is loaded so don't do anything
		    })
		    .error(function(){
		        //Image doesn't exist so clear this out
		        $j(this).remove();
		    });
		    
		    function makeNewColumn(oldCol,newCol,n) {
		        rpt.find( 'div.'+newCol ).prepend( rpt.find( 'div.'+oldCol+' tbody tr:eq('+n+')').closest('table').nextAll() );
		        
		        if ( rpt.find( 'div.'+oldCol+' tbody tr:eq('+n+')').prevAll().length < 4 ) {
		        	rpt.find( 'div.'+newCol ).prepend( rpt.find( 'div.'+oldCol+' tbody tr:eq('+n+')').closest('table') );
		        } else {
		        	rpt.find( 'div.'+oldCol+' tbody tr:eq('+n+')').addClass('breakHere');
		        	rpt.find( 'div.'+newCol ).prepend( rpt.find( 'div.'+oldCol+' tbody tr:eq('+n+')').closest('table').clone() );
		        	rpt.find( 'div.'+oldCol+' tbody tr.breakHere').removeClass('breakHere').nextAll().remove();
		        	rpt.find( 'div.'+newCol+' tbody tr.breakHere').closest('table').find('thead tr td:first').text( rpt.find( 'div.'+newCol+' tbody tr.breakHere').closest('table').find('thead tr td:first').text() + ' cont.' );
		        	rpt.find( 'div.'+newCol+' tbody tr.breakHere').prevAll().remove();
		        	rpt.find( 'div.'+newCol+' tbody tr.breakHere').remove();
		        }
		    }
		    
		    function processRawStandards() {
		    	stan2grade.find('tbody tr').each(function(){
		    		if ( ($j(this).find('td.standard2').data('excludefromreport') == 1) || ($j(this).find('td.standard3').data('excludefromreport') == 1) ){
		    			//this section does not count for reporting
		    			excludefromreport = 1;
		    			$j(this).remove();
		    		} else {
		    			excludefromreport = 0;
		    			
		    			//set course info
		    			curCrsNum = $j(this).find('td.ccinfo').data('crsnum');
		    			curSecDCID = $j(this).find('td.ccinfo').data('sectionsdcid');
		    			curEndDate = $j(this).find('td.ccinfo').data('enddate');
		    			curSC = $j(this).find('td.ccinfo').data('sc').toLowerCase();
		    			
		    			//set header info
		    			curHeadStandardID = $j(this).find('td.standard2').data('standardid');
		    			curHeadStanName = $j(this).find('td.standard2').data('stanname');
		    			curHeadStanDesc = $j(this).find('td.standard2').data('stanid') + ': ' + $j(this).find('td.standard2').data('standesc');
		    			curHeadStanID =  $j(this).find('td.standard2').data('stanid');
		    			curHeadStanSub = $j(this).find('td.standard2').data('stansub');
		    			curHeadStanGraded = $j(this).find('td.standard2').data('stangraded');
		    			curHeadStanComment = $j(this).find('td.standard2').data('stancomment');
		    			
		    			//set regular info
		    			curStandardID = $j(this).find('td.standard3').data('standardid');
		    			curStanName = $j(this).find('td.standard3').data('stanname');
		    			curStanDesc = $j(this).find('td.standard3').data('stanid') + ': ' + $j(this).find('td.standard3').data('standesc');
		    			curStanID =  $j(this).find('td.standard3').data('stanid');
		    			curStanSub = $j(this).find('td.standard3').data('stansub');
		    			curStanGraded = $j(this).find('td.standard3').data('stangraded');
		    			curStanComment = $j(this).find('td.standard3').data('stancomment');
		    		}
		    		
		    		//if new header then start new table
		    		if ( lastHeadStandardID != curHeadStandardID ) {
		    			lastHeadStandardID = curHeadStandardID;
		    			
		    			rpt.find('div.p1c1').append(
		    				'<table class="grid standardgrades" id="'+sid+'_'+yid+'_'+curHeadStandardID+'">\
		    				<colgroup><col class="standard"><col class="t1"><col class="t2"><col class="t3"></colgroup>\
		    				<thead>\
		    				<tr data-standardid="'+curHeadStandardID+'" data-stanid="'+ curHeadStanID +'" data-stansub="'+ curHeadStanSub +'" data-stangraded="'+ curHeadStanGraded +'" data-stancomment="'+ curHeadStanComment +'">\
		    				<td class="standard" title="'+curHeadStanDesc+'">'+curHeadStanName+'</td>\
		    				<td class="t1">T1</td>\
		    				<td class="t2">T2</td>\
		    				<td class="t3">T3</td>\
		    				</tr>\
		    				</thead>\
		    				<tbody>\
		    				</tbody>\
		    				</table>'
		    			);
		    			if ( curHeadStanComment == 1 ) {
		    				rpt.find('div.p1c1 table.standardgrades#'+sid+'_'+yid+'_'+curHeadStandardID).after(
		    					'<table class="grid standardcomments" id="'+sid+'_'+yid+'_'+curHeadStandardID+'">\
		    					<tbody>\
		    					<tr class="t1"><td data-standardid="'+curHeadStandardID+'">Term 1 Teacher Comments: </td></tr>\
		    					<tr class="t2"><td data-standardid="'+curHeadStandardID+'">Term 2 Teacher Comments: </td></tr>\
		    					<tr class="t3"><td data-standardid="'+curHeadStandardID+'">Term 3 Teacher Comments: </td></tr>\
		    					</tbody>\
		    					</table>'
		    				);
		    			}
		    		}
		    		
		    		//if new standard then add to the header table
		    		if ( lastStandardID != curStandardID ) {
		    			lastStandardID = curStandardID;
		    			
		    			rpt.find('table.standardgrades#'+sid+'_'+yid+'_'+curHeadStandardID+' tbody').append(
		    				'<tr data-standardid="'+curStandardID+'" data-stanid="'+ curStanID +'" data-stansub="'+ curStanSub +'" data-stangraded="'+ curStanGraded +'" data-stancomment="'+ curStanComment +'">\
		    				<td class="standard" title="'+curStanDesc+'">'+curStanName+'</td>\
		    				<td class="t1" data-crsnum="" data-sectionsdcid="" data-enddate=""></td>\
		    				<td class="t2" data-crsnum="" data-sectionsdcid="" data-enddate=""></td>\
		    				<td class="t3" data-crsnum="" data-sectionsdcid="" data-enddate=""></td>\
		    				</tr>'
		    			);
		    			
		    		}
		    		
		    		//Set the grade cell data elements to the current course values. This helps find the right grade later
		    		rpt.find('table#'+sid+'_'+yid+'_'+curHeadStandardID+' tbody tr[data-standardid="'+ curStandardID +'"] td.'+curSC)
		    	    	.data('crsnum',curCrsNum)
		    			.data('sectionsdcid',curSecDCID)
		    			.data('enddate',curEndDate);
		    			
		    		$j(this).hide();
		    	});
		    }
		    
		    function processStandardGrades() {
		    	//fill in standards grades
		    	tempStanGrades.find('tbody tr').each(function(){
		    		curRow = $j(this);
		    		curStandardID = $j(this).find('td.standardid').data('standardid');
		    		curSecDCID = $j(this).find('td.sectionsdcid').data('sectionsdcid');
		    		curCrsNum = $j(this).find('td.section').data('crsnum');
		    		curSC = $j(this).find('td.sc').data('sc').toLowerCase();
		    		curGrade = $j(this).find('td.grade').data('grade');
		    		
		    		rpt.find('table.standardgrades tbody tr[data-standardid="'+curStandardID+'"] td.'+curSC).each(function(){
		    			//if crsnum is blank then do the less reliable method
		    			if ( curCrsNum == '' ) {
		    				$j(this).text(curGrade);
		    				curRow.addClass('hide');
		    			} else if ( $j(this).data('crsnum') != curCrsNum ) {
		    				//not the right course, skip
		    			} else if ( $j(this).text() == '' ) {
		    				//cell is empty, fill it
		    				$j(this).text(curGrade);
		    				curRow.addClass('hide');
		    			} else {
		    				//cell is not empty, check the secdcid
		    				if ( $j(this).data('sectionsdcid') == curSecDCID ) {
		    					$j(this).text(curGrade);
		    					curRow.addClass('hide');
		    				}
		    			}
		    		});
		    	});
		    }
		    
		    function processStandardComments() {
		    	//fill in standard comments
		    	tempStanComments.find('tbody tr').each(function(){
		    		curRow = $j(this);
		    		curStandardID = $j(this).find('td.standardid').data('standardid');
		    		curSC = $j(this).find('td.sc').data('sc').toLowerCase();
		    		
		    		rpt.find('table.standardcomments tr.'+curSC+' td[data-standardid="'+curStandardID+'"]').append( $j(this).find('td.comment').text() );
		    		
		    	});
		    }
		    
		    if (gr <= 3) {
		    	rpt.addClass('k2');
		    	if ( sc == 'T3' ) {
		    		rpt.find('.promoted tbody td:first').text( rpt.find('table.k2Header1').data('promoted') );
		    	} else {
		    		rpt.find('.promoted').remove();
		    	}
		    	processRawStandards();
		    	processStandardGrades();
		    	processStandardComments();
		    	
		    	if (gr <= 0) {
		    		rpt.find('.t1').remove();
		    	}
		    	rpt.find('div.tbl.pg2').after( rpt.find('div.p1c1').contents() );
		    	rpt.find('div.tbl,div.pageafter').remove();
		    } else {
		    	rpt.addClass('gr36');
		    	rpt.find('table.k2Header1').addClass('gr36Header1').removeClass('k2Header1').appendTo( rpt.find('div.p1c1') );
		    	rpt.find('table.performancekey').appendTo( rpt.find('div.p1c1') );
		    	rpt.find('table.behaviorkey').appendTo( rpt.find('div.p1c1') );
		    	rpt.find('.k2Header2,.k2Header3,.promoted').remove();
		    	rpt.find('.col').css('width','48%');
		    	rpt.find('.gr36Header1 tbody tr:first td:first').prop('rowspan','5');
		    	rpt.find('.gr36Header1 tbody tr:first td:last').html(
		    		'<span class="schoolName">'+ rpt.find('.gr36Header1').data('school') +' '+ rpt.find('.gr36Header1').data('yr') +'</span>\
		    		<br>'+rpt.find('.gr36Header1').data('town')+', Massachusetts\
		    		<br>Standards-Based '+rpt.find('.gr36Header1').data('gr')+' Report Card'
		    	);
		    	
		    	if ( rpt.find('.gr36Header1').data('aprincipal') == '' ) {
		    		rpt.find('.gr36Header1 tbody tr:eq(1) td:last').html(
		    			rpt.find('.gr36Header1').data('principal') +', Principal'
		    		);
		    	} else {
		    		rpt.find('.gr36Header1 tbody tr:eq(1) td:last').html(
		    			rpt.find('.gr36Header1').data('principal') +', Principal\
		    			<br>'+ rpt.find('.gr36Header1').data('aprincipal') +', Assistant Principal'
		    		);
		    	}
		    	
		    	rpt.find('.gr36Header1 tbody tr:eq(2) td:last').html(
		    		'<span class="mission">'+ rpt.find('.gr36Header1').data('mission') +'</span>'
		    	);
		    	rpt.find('.gr36Header1 tbody tr:eq(3) td:last').html(
		    		'<span class="stdName">'+ rpt.find('.gr36Header1').data('std') +'</span>'
		    	);
		    	
		    	rpt.find('.gr36Header1 tbody').append(
		    		'<tr>\
		    		<td class="homeroom">Homeroom Teacher: '+ rpt.find('.gr36Header1').data('tchr') +'</td>\
		    		</tr>'
		    	);
		    	
		    	processRawStandards();
		    	processStandardGrades();
		    	makeNewColumn('p1c1','p1c2',p1limit);
		    	makeNewColumn('p1c2','p2c1',p2limit);
		    	makeNewColumn('p2c1','p2c2',p2limit);
		    }
		    
		    //cleanup 
		    if ( rpt.data('userid') == 2 ) {
		    	stan2grade.hide();
		    	tempStanGrades.hide();
		    	tempStanComments.hide();
		    } else {
		    	stan2grade.remove();
		    	tempStanGrades.remove();
		    	tempStanComments.remove();
		    }
		}
	});
}

function getMultiple(portal) {
	var nreports = $j('div#reportsToShow div.reportCardDiv').length,
		processedReports = 0;
		
	$j('div#status').html('<div id="directions" class="feedback-alert">Processing '+nreports+' report cards. This may take several minutes to complete.  Reports will appear once all Report Cards have been generated.</div>');
	
	$j('div#reportsToShow div.reportCardDiv').each(function(){
		var yid = $j(this).data('yearid'),
			sc = $j(this).data('sc'),
			a = $j(this).data('action'),
			sdcid = $j(this).data('sdcid'),
			gr = $j(this).data('gr'),
			yr = 1990+yid;
		
		$j(this).load('reportCardData.html?action='+a+'&frn=001'+sdcid+'&yid='+yid+'&sc='+sc+'&yr='+yr+'&gr='+gr,function(){ 
			processedReports++;
			if (processedReports == nreports) { processReports(portal); }
		});
	});
}