Ext.setup({
    onReady:function(){
    	
    	
    	// -------------main calculation---------------
		window.generateData = function(loan_amount,loan_term,interest_rate,frequency,rtype){
			var period=0; var power=0; var term_interest=0; var payment=0;var data=[];
			if (frequency=="1"){
				period=52;
			}
			if (frequency=="2"){
				period=26;
			}
			if (frequency=="3"){
				period=12;
			}
			
			power=loan_term*period;
			term_interest=interest_rate/(period*100);
			payment=loan_amount*term_interest*Math.pow((1+term_interest),power)/(Math.pow((1+term_interest),power)-1);
			
			var total_repayment = payment*loan_term*period;
			var interest_only_payment=1*loan_amount*term_interest;
			var interest_only_total_repayment=1*loan_amount+1*interest_only_payment*period*loan_term;
			
			for (var i=0;i<=power;i++){
				if (i%period==0){		
					var year_term = i/period;
					if (rtype=='1'){
						var result_including_interest = Math.round(total_repayment-year_term*payment*period);
						var a1 = Math.pow((1+term_interest),i)*loan_amount;
						var a2 = Math.pow((1+term_interest),i)-1;
						var a3 = a2*payment/term_interest;
						var a4 = a1-a3;
						var result_home_loan=Math.round(a4);
					}
					else if (rtype=='2'){
						var result_home_loan = 1*loan_amount;
						var result_including_interest = Math.round(interest_only_total_repayment-year_term*interest_only_payment*period);
						}
					var exact_year = i/period;
					data.push({
						name: exact_year,
						Home_Loan: result_home_loan,
						Including_Interest: result_including_interest
					});
				}
			}
			console.log(data);
			return data;
		};
		// --------------end main calculation----------------
    	
		// --------------initial data------------
    	window.store1 = new Ext.data.JsonStore({
    		fields: ['name','Home_Loan','Including_Interest'],
    		data: generateData(600000,30,7,1,1)
    	});
    	// --------------end initial data------------
    	
    	//---------------first page for entering data-------------
		var Forms = new Ext.chart.Panel({
			title: 'Repayment Calculator' ,
			layout: 'fit',
			items: [{
				title: 'Input',
				xtype: 'form',
				id: 'basicform',
				name: 'myForm',
				scroll: 'vertical',
				items: [{
					xtype: 'toolbar',
					dock: 'top',
					id: 'selection',
					items: [{
						xtype: 'selectfield',
						name: 'options',
						id: 'selection1',
						options: [
							{text: 'Normal', value: '1'},
							{text: 'Offset', value: '2'}
						],
						listeners: {
							change: function(){
								var y = Ext.getCmp('selection1').getValue();
								alert (y);
							}
						}
					}]
				},{
					xtype: 'fieldset',
					title: 'Please input your detail',
					defaults: {
						labelWidth: '35%'
					},
					items: [{
						xtype: 'numberfield',
						name: 'loan_amount',
						id: 'loan_amount',
						label: 'Loan amount ($)',
						required: true,
						useClearIcon: true,
						value: 600000,
						listeners: {
							blur: function(){
								onRefresh();
							}
						}
					},{
						xtype: 'numberfield',
						name: 'loan_term',
						id:'loan_term',
						label: 'Mortgage term (year)',
						required: true,
						useClearIcon: true,
						minValue: 0,
						maxValue: 40,
						value: 30,
						listeners: {
							blur: function(){
								onRefresh();
							}
						}
					},{
						xtype: 'numberfield',
						name: 'interest_rate',
						id: 'interest_rate',
						label: 'Interest rate (%)',
						required: true,
						useClearIcon: true,
						stepValue: '0.01',
						minValue: 2,
						maxValue: 8,
						value: 7,
						listeners: {
							blur: function(){
								onRefresh();
							}
						}
					},{
						xtype: 'selectfield',
						name: 'frequency',
						id: 'frequency',
						label: 'Repayment frequency',
						value: '1',
						options: [
							{text: 'Weekly', value: '1'},
							{text: 'Fornightly', value: '2'},
							{text: 'Monthly', value: '3'}
						],
						listeners: {
							change: function(){
								onRefresh();
							}
						}
					},{
						xtype: 'selectfield',
						name: 'rtype',
						id:'rtype',
						label: 'Repayment type',
						value: '1',
						options: [
							{text: 'Principal & Interest', value: '1'},
							{text: 'Interest Only', value: '2'}
						],
						listeners: {
							change: function(){
								onRefresh();
							}
						}
					}]
				}]
			}]
		});
		//---------------first page for entering data-------------
		   	
    	//---------------function of updating data----------------
    	var onRefresh = function() {
    		var loan_amount = new Ext.getCmp('loan_amount').getValue();
			var loan_term = new Ext.getCmp('loan_term').getValue();
			var interest_rate = new Ext.getCmp('interest_rate').getValue();
			var frequency = new Ext.getCmp('frequency').getValue();
			var rtype = new Ext.getCmp('rtype').getValue();
		
    		window.store1.loadData(generateData(loan_amount,loan_term,interest_rate,frequency,rtype));
        	
        };
        //---------------end function of updating data----------------
		
        //---------------displaying graph-----------------------------
		var myGraph = new Ext.chart.Panel({
            title: 'Line Chart',
            layout: 'fit',
            id: 'newGraph',
            items: [{
                cls: 'line1',
                store: store1,
                animate: true,
                shadow: true,
                legend: {
                    position: 'right'
                },
                interactions: [{
                	type: 'panzoom',
                    	axes: {
                    	    left: {}
                    	}
               	 }, {
                   	type: 'iteminfo',
                   	listeners: {
                       show: function(interaction, item, panel) {
                           var storeItem = item.storeItem;
                           panel.update(['<ul><li><b>Month: </b>' + storeItem.get('name') + '</li>', '<li><b>Value: </b> ' + item.value[1]+ '</li></ul>'].join(''));
                       }
               	    }
               	}],
                axes: [{
                    type: 'Numeric',
                    minimum: 0,
                    position: 'left',
                    fields: ['Home_Loan', 'Including_Interest'],
                    title: 'Number of Hits',
                    minorTickSteps: 1
                }, {
                    type: 'Numeric',
                    position: 'bottom',
                    fields: ['name'],
                    title: 'Month of the Year'
                }],
                series: [{
                    type: 'line',
                    highlight: {
                        size: 7,
                        radius: 7
                    },
                    fill: true,
                    smooth: true,
                    axis: 'left',
                    xField: 'name',
                    yField: 'Home_Loan'
                }, {
                    type: 'line',
                    highlight: {
                        size: 7,
                        radius: 7
                    },
                    fill: true,
                    axis: 'left',
                    smooth: true,
                    xField: 'name',
                    yField: 'Including_Interest'
                }]
            }]
        });
        //---------------end displaying graph-----------------------------
		
        //---------------tab panel-------------------------
		var tabpanel = new Ext.TabPanel({
			tabBar: {
         	dock: 'bottom',
            layout: {
                pack: 'center'
            }
         },
         fullscreen: true,
         cardSwitchAnimation: {
            type: 'slide'
         },
         items: [Forms,myGraph]
      });
        //---------------end tab panel-------------------------
	}
});