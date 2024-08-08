(function($) {
	
	// Функция переключения классов при клике на блок/ссылку.
	
    $.fn.MVisionToggleClass = function(cfg) {
		
		// Сбор необходимой информации
		// --------------------------------------------------------------------------------------------------------------
		
		// Набор настроек по умолчанию.
        var default_cfg = {
			
			classButton: 'class-button',				// Класс кнопки.
			toggleClassButton: 'new-class-button',		// Новый класс для кнопки после клика на нее.
			dataButtonAttr: 'data-button',				// Data атрибут кнопки, в него задаем имя блока которому переключаем класс. Например <div data-button="block_name">Кнопка</div>.
			
			classBox: 'class-box',						// Класс блока.
			toggleClassBox: 'new-class-box',			// Новый класс для блока после клика на соответствующую кнопку.
            dataBoxAttr: 'data-box',					// Data атрибут блока, ему задаем уникальное имя, которое указали кнопке. Например <div data-box="block_name">Блок</div>.
			
			cancelOutside: false,						// Убирать ли добавленные классы при клике из вне блока или кнопки.
			cancelRepeat: false,						// Убирать ли добавленные классы при повторном клике на кнопку.
			
			defaultElement: false,						// Включить ли добвление класса по умолчанию.
			defaultIndexElement: 0,						// Индекст елемента для добавления класса по умолчанию. Начиная с 0.

			ancoreLinks: false,							// Включить ли акорные ссылки, для отображения блока при переходе на domain.ru/page#block
			ancoreParent: false,						// Есть ли родитель у переключателя.
			
     	};
        
		// Переопределение пользовательских настроек.
		var cfg = $.extend(default_cfg, cfg);
		
		// Информация об объектах.
        var data = {  
			btn: $(this).find('.' + cfg.classButton + '[' + cfg.dataButtonAttr + ']'),
			box: $(this).find('.' + cfg.classBox + '[' + cfg.dataBoxAttr + ']'),
			anc: window.location.hash.replace("#",""),
     	};
		
		//window.location.href = "asd";

		console.log(window.location.hash);
		
		// Если включены анкорные ссылки
		if(cfg.ancoreLinks && data.anc){
			
			if(cfg.ancoreParent){ 

				if($('*[data-name-tab = ' + cfg.ancoreParent + ']').length > 0 && $('*[data-name-tab=' + cfg.ancoreParent + ']').find('.' + cfg.classBox + '[data-name-tab=' + data.anc + ']').length > 0){
					
					$('*[data-open-tab = ' + cfg.ancoreParent + ']').addClass('active');
					$('*[data-name-tab = ' + cfg.ancoreParent + ']').addClass('active');

				}
				
			}
				
			if(data.btn.length > 0 && data.box.length > 0){
				data.btn.each(function(){
					if($(this).attr(cfg.dataButtonAttr) == data.anc){
						data.btn.removeClass(cfg.toggleClassButton);
						$(this).addClass(cfg.toggleClassButton);
					}
				});
				data.box.each(function(){
					if($(this).attr(cfg.dataBoxAttr) == data.anc){
						data.box.removeClass(cfg.toggleClassBox);
						$(this).addClass(cfg.toggleClassBox);
					}
				});
			}
		}


		// Выставляем классы по умолчанию если defaultElement = true
		if(cfg.defaultElement && !data.anc){
			data.btn.eq(cfg.defaultIndexElement).addClass(cfg.toggleClassButton);
			data.box.eq(cfg.defaultIndexElement).addClass(cfg.toggleClassBox);
		}
		
		// Делаем кнопкам еффект наведения ссылок.
		data.btn.css('cursor','pointer');
		
		// При клике на кнопку.
		data.btn.click(function(event){
			
			// Отключаем все события, на случай если это ссылка.
			event.preventDefault();
			
			// Если кликаем на не активную кнопку
			if(!$(this).hasClass(cfg.toggleClassButton)){
				
				// Считываем data атрибут кнопки.
				var dataBoxAttr = $(this).attr(cfg.dataButtonAttr);
				
				// Переключаем класс кнопоки.
				data.btn.removeClass(cfg.toggleClassButton);
				$(this).addClass(cfg.toggleClassButton);

				// Переключаем класс блока.
				data.box.removeClass(cfg.toggleClassBox);
				//data.box.attr(cfg.dataBoxAttr, dataBoxAttr).addClass(cfg.toggleClassBox);
				$('.' + cfg.classBox + '[' + cfg.dataBoxAttr + ' = ' + dataBoxAttr + ']').addClass(cfg.toggleClassBox);
				
				// Изменяем анкорную ссылку в окне браузера
				if(cfg.ancoreLinks){
					window.location.hash = "#" + $(this).attr(cfg.dataButtonAttr);
				}
			}
			else{
				
				// Если кликаем на активную кнопку и cancelRepeat = true
				if(cfg.cancelRepeat){
					
					// Убираем активные классы со всех блоков и кнопок.
					data.btn.removeClass(cfg.toggleClassButton);
					data.box.removeClass(cfg.toggleClassButton);
				}
			}
		});

		// Если cancelOutside = true
		if(cfg.cancelOutside){
			$(document).mousedown(function (e){
				// Если при клике элемент не является нашим блоком или кнопкой.
				if ((!data.box.is(e.target) && data.box.has(e.target).length === 0) && (!data.btn.is(e.target) && data.btn.has(e.target).length === 0)){
					// Убираем активные классы со всех блоков и кнопок.
					data.btn.removeClass(cfg.toggleClassButton);
					data.box.removeClass(cfg.toggleClassButton);
				}
			});	
		}
	}

})(jQuery);
