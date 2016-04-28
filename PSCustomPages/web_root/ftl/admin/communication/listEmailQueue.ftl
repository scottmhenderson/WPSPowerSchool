<!DOCTYPE html>
<html>
<head>
	<title><@s.text name="psx.html.admin_tech.outgoingmailqueue.outgoing_mail_queue2" /></title>
</head>

<body>

<content tag="breadcrumbs"><@s.text name="psx.ftl.admin_communication.listEmailQueue.start_page" />:/admin/home.html|<@s.text name="psx.ftl.admin_communication.listEmailQueue.system_administrator" />:/admin/tech|<@s.text name="psx.ftl.admin_communication.listEmailQueue.system_settings" />:/admin/systemsettings|<@s.text name="psx.ftl.admin_communication.listEmailQueue.outgoing_mail_queue" /></content>
<@pss.legacy>~[wc:sm_psadmin_content]</@pss.legacy>

<#include "/pss-macros.ftl" />
<script src="${imageServer!""}/scripts/psTableToGridWidget.js"></script>
<script>
	function filterChange(){
		$j('<input>').attr({type:'hidden',name:'maxResults',value:$j('#maxResults').attr('value')}).appendTo('#filters');
		$j('#filters').submit();
	}
	function pageNext(){
		$j('<input>').attr({type:'hidden',name:'next',value:'true'}).appendTo('#filters');
		$j('<input>').attr({type:'hidden',name:'pageNumber',value:$j('#pageNumber').attr('value')}).appendTo('#filters');
		$j('<input>').attr({type:'hidden',name:'maxResults',value:$j('#maxResults').attr('value')}).appendTo('#filters');
		$j('#filters').submit();
	}
	function pagePrev(){
		$j('<input>').attr({type:'hidden',name:'prev',value:'true'}).appendTo('#filters');
		$j('<input>').attr({type:'hidden',name:'pageNumber',value:$j('#pageNumber').attr('value')}).appendTo('#filters');
		$j('<input>').attr({type:'hidden',name:'maxResults',value:$j('#maxResults').attr('value')}).appendTo('#filters');
		$j('#filters').submit();
	}
	function arbitraryPage(){
	    var quantityRegexp = /^(0|[1-9]+[0-9]*)$/;
        if (!quantityRegexp.test($j('#pageNumber').attr('value'))) {
           $j('#pageNumber').attr('value',1);
		}
		if($j('#pageNumber').attr('value')>$j('#totalPageNumber').attr('value')){
			$j('#pageNumber').attr('value',$j('#totalPageNumber').attr('value'));	
		}
		if($j('#pageNumber').attr('value')<1){
			$j('#pageNumber').attr('value',1);
		}
		$j('<input>').attr({type:'hidden',name:'next',value:'false'}).appendTo('#filters');
		$j('<input>').attr({type:'hidden',name:'prev',value:'false'}).appendTo('#filters');
		$j('<input>').attr({type:'hidden',name:'arbitraryPage',value:'true'}).appendTo('#filters');
		$j('<input>').attr({type:'hidden',name:'pageNumber',value:$j('#pageNumber').attr('value')}).appendTo('#filters');
		$j('<input>').attr({type:'hidden',name:'maxResults',value:$j('#maxResults').attr('value')}).appendTo('#filters');
		$j('#filters').submit();
	}
	function perPageChange(){
		$j('<input>').attr({type:'hidden',name:'maxResults',value:$j('#maxResults').attr('value')}).appendTo('#filters');
		$j('#filters').submit();
	}
</script>
<#global dateFormat><@pss.getDateFormat content="mmddyyyy"/></#global>

<h1><@s.text name="psx.html.admin_systemsettings.emailsetup.email_setup2" /></h1>

<!-- start of content and bounding box -->
<ul class="tabs"> 
     <li> 
         <a href="/admin/systemsettings/emailsetup.html"><@s.text name="psx.html.admin_systemsettings.emailsetup.email_setup2" /></a> 
     </li> 
     <li class="selected">
         <a href="/admin/listEmailQueue.action"><@s.text name="psx.html.admin_tech.outgoingmailqueue.outgoing_mail_queue2" /></a> 
     </li> 
     <li>
         <a href="/admin/tech/testmail.html"><@s.text name="psx.html.admin_tech.testmail.test_email2" /></a> 
     </li> 
</ul>

<div class="box-round">
	<!-- div class="button-bar">
		<@s.text name="psx.ftl.admin_communication.listEmailQueue.filter_to_only_these_status_values" />:<br>
		<#list statusValueMap?keys as displayName>
			<#assign internalValue = statusValueMap[displayName]>
			<input name="statusValues" type="checkbox" value="${internalValue}">${displayName}
		</#list>
	</div -->
	<h2 class="toggle expanded filtersHeader"><@s.text name="psx.ftl.admin_sections.classRosterDetailView.filter_results_by"/><span><@s.text name="psx.ftl.admin_sections.classRosterDetailView.filtered_by"/><#if filters.component!=""><@s.text name="psx.ftl.admin_communication.listEmailQueue.component"/><#if filters.status!=""||filters.date!="">,&nbsp;</#if></#if><#if filters.status!=""><@s.text name="psx.ftl.admin_communication.listEmailQueue.status"/><#if filters.date!="">,&nbsp;</#if></#if><#if filters.date!=""><@s.text name="psx.ftl.admin_communication.listEmailQueue.date"/></#if></span></h2>
	<form id="filters" action="/admin/listEmailQueue.action" method="get">
	<table class="resultsFilters">
		<tr>
			<td><label><@s.text name="psx.ftl.admin_communication.listEmailQueue.component"/>:&nbsp;</label><select id="component" name="component" style="width:auto;" onChange="filterChange()"><option value=""><@s.text name="psx.ftl.admin_communication.listEmailQueue.all"/></option><option value="PowerSchool"<#if filters.component="PowerSchool">selected</#if>><@s.text name="psx.ftl.admin_communication.listEmailQueue.powerschool"/></option><option value="PowerTeacher" <#if filters.component="PowerTeacher">selected</#if>><@s.text name="psx.ftl.admin_communication.listEmailQueue.powerteacher"/></option></select></td>
			<td><label><@s.text name="psx.ftl.admin_communication.listEmailQueue.status"/>:&nbsp;</label><select id="status" name="status" style="width:auto;" onChange="filterChange()"><option value=""><@s.text name="psx.ftl.admin_communication.listEmailQueue.all"/></option><option value="pending" <#if filters.status="pending">selected</#if>><@s.text name="psx.ftl.admin_communication.listEmailQueue.pending"/></option><option value="completed" <#if filters.status="completed">selected</#if>><@s.text name="psx.ftl.admin_communication.listEmailQueue.completed"/></option><option value="failed" <#if filters.status="failed">selected</#if>><@s.text name="psx.ftl.admin_communication.listEmailQueue.failed"/></option></select></td>
			<td><label><@s.text name="psx.ftl.admin_communication.listEmailQueue.date" />:&nbsp;</label>
			<input type="text" class="psDateWidget" name="latestDate" id="latestDate" size="10" maxlength="10" onChange="filterChange()" <#if filters.date!="">value="${filters.date!""}"</#if>></td>			
		</tr>
	</table>
	</form>
	
	
	<h2><@s.text name="psx.ftl.admin_sections.classRosterDetailView.results"/></h2>
	<table border="0" cellspacing="0" cellpadding="4" id="queueTable" name="queueTable">
		<thead>
		<tr bgcolor="#f6f6f6">
			<th class="bold"><@s.text name="psx.ftl.admin_communication.listEmailQueue.date" /></td>
			<th class="bold"><@s.text name="psx.ftl.admin_communication.listEmailQueue.component"/></td>
			<th class="bold"><@s.text name="psx.ftl.admin_communication.listEmailQueue.status" /></td>
			<th class="bold"><@s.text name="psx.ftl.admin_communication.listEmailQueue.recipients" /></td>
			<th class="bold"><@s.text name="psx.ftl.admin_communication.listEmailQueue.subject" /></td>
		</tr>
		</thead>
		<tbody>
		<#if (messages?? && messages?size>0)>
			<#list messages as message>
				<tr <#if (message_index % 2) ==0>class="alt"</#if>>
					<td valign="top">${message.createdTs?string(dateFormat)!''}</td>
					<td valign="top">${message.applicationComponent.componentName!""}</td>
					<td><#if message.jobStatus??><@codeMap type="QuartzJobStatus" id=message.jobStatus.status /><#else><@s.text name="psx.ftl.admin_communication.listEmailQueue.unscheduled" /></#if></td>
					<td>
					<#-- Don't spread on different lines because of spacing -->
					<#list message.emailRecipients as recip><#if recip_index gt 0>, </#if><#if recip.emailDisplayName??>${recip.emailDisplayName!""}&lt;${recip.emailAddress}&gt;<#else>${recip.emailAddress}</#if></#list>
					</td>
					<td>${message.subject!''}</td>
				</tr>
			</#list>
		</#if>
		<tr bgcolor="#f6f6f6" style="text-align:center"><td colspan=5 ><button class="prev" onclick="pagePrev()"<#if pageNumber <= 1>disabled</#if>><@s.text name="psx.ftl.admin_communication.listEmailQueue.prev" /></button>&nbsp;&nbsp;<@s.text name="psx.ftl.admin_communication.listEmailQueue.page" /><input name="pageNumber" id="pageNumber" type="text" size="${(pageNumber?length)+2}" value="${pageNumber!""}" style="text-align:center" onChange="arbitraryPage()" <@pss.getValidation Validationkey="queueTable.pageNumber"/>/><@s.text name="psx.ftl.admin_communication.listEmailQueue.of"><@s.param>${totalPageNumber!""}</@s.param></@s.text><input type="hidden" id="totalPageNumber" value="${totalPageNumber!""}"/><button class="next" onclick="pageNext()" <#if pageNumber &gt;= totalPageNumber>disabled</#if>><@s.text name="psx.ftl.admin_communication.listEmailQueue.next" /></button>&nbsp;&nbsp;<@s.text name="psx.ftl.admin_communication.listEmailQueue.per_page" /><Select id="maxResults" name="maxResults" onChange="perPageChange()"><option value="10" <#if maxResults=10>selected</#if>>10</option><option value="20" <#if maxResults=20>selected</#if>>20</option><option value="50" <#if maxResults=50>selected</#if>>50</option></select></td></tr
		</tbody>
	</table>
		
<!-- End of main content -->
</div>
<!-- end of content of bounding box -->



</body>
</html>