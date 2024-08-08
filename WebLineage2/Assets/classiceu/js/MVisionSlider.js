(function($) {
	
    $.fn.MVisionSlider = function(cfg) {
		
		// Сбор необходимой информации
		// --------------------------------------------------------------------------------------------------------------
		
		// Набор настроек по умолчанию.
        var default_cfg = {
			
			autoSlide: false,								// Включить ли автослистывание слайдов.
            showTime: 3000,									// Длительность отображения активного слайда в милисекундах.
			actionShowTime: 6000,							// Длительность отображения активного слайда после действий в навигации в милисекундах.
			
			animationSlide: 'horizontal',					// Анимация перелистывания слистывания слайдов - horizontal, vertical, appearance.
			animationTimeSlide: 500,						// Скороть перелистывания слистывания слайдов в милисекундах.
			
			classSlide: 'MVisionSlider__item',				// Класс слайда.
			classActiveSlide: 'active',						// Класс активного слайда.

			showMarkers: true,								// Показывать ли маркеры.
			iconMarker: '•',								// Иконка маркера, может принимать html код.
			classMarkers: 'MVisionSlider__markers',			// Класс блока с маркерами.
			classMarker: 'MVisionSlider__marker',			// Класс маркера.
			classActiveMarker: 'active',					// Класс активного маркера.
			
			showArrows: true,								// Показывать ли стрелки.
			classPrevArrow: 'MVisionSlider__prev-arrow',	// Класс стрелки "Perv".
			classNextArrow: 'MVisionSlider__next-arrow',	// Класс стрелки "Next".
			iconPrevArrow: '<',								// Иконка стрелки "Perv", может принимать html код.
			iconNextArrow: '>',								// Иконка стрелки "Next", может принимать html код.
			
			combineNav: false,								// Включить ли комбинированную навигацию (стрелки и маркеры в одном блоке).
			classСombineNav: 'MVisionSlider__nav',			// Класс блока комбинированной навигации.
			
     	};
        
		// Переопределение пользовательских настроек.
		var cfg = $.extend(default_cfg, cfg);
		
		// Информация об объекте.
        var data = {  
            main: $(this),
			slide: $(this).find('.' + cfg.classSlide),
			slideCount: $(this).find('.' + cfg.classSlide).size(),
     	};
		
		// Создание разметки для навигации
		// --------------------------------------------------------------------------------------------------------------
		
		// Добавляем активный класс для первого слайда.
		data.slide.eq(0).addClass(cfg.classActiveSlide);
		
		// Если combineNav = true, объеденяем навигацию в один блок
		if(cfg.combineNav && data.slideCount > 1){
			
			// Если включено хоть что-то одно - маркеры или стрелки, в противном случае не продим лишние блоки
			if(cfg.showArrows || cfg.showMarkers){
				
				data.main.append('<div class="' + cfg.classСombineNav + '"></div>');
			
				// Если showArrows = true добавляем стрелку Perv.
				if(cfg.showArrows){
					data.main.find('.' + cfg.classСombineNav).append('<div class="' + cfg.classPrevArrow + '">' + cfg.iconPrevArrow + '</div>');
				}
				
				// Если showMarkers = true добавляем маркеры, первому маркеру добавляем активный класс.
				if(cfg.showMarkers){
					data.main.find('.' + cfg.classСombineNav).append('<div class="' + cfg.classMarkers + '"></div>');
					for( let i = 0; i < data.slideCount; i++){
						if(i == 0){
							data.main.find('.' + cfg.classMarkers).append('<div class="' + cfg.classMarker + ' ' + cfg.classActiveMarker + '">' + cfg.iconMarker + '</div>');
						}
						else{
							data.main.find('.' + cfg.classMarkers).append('<div class="' + cfg.classMarker + '">' + cfg.iconMarker + '</div>');
						}
					}
				}
				
				// Если showArrows = true добавляем стрелку Next.
				if(cfg.showArrows){
					data.main.find('.' + cfg.classСombineNav).append('<div class="' + cfg.classNextArrow + '">' + cfg.iconNextArrow + '</div>');
				}
			}
		}
		else{
			// Если showMarkers = true добавляем маркеры, первому маркеру добавляем активный класс.
			if(cfg.showMarkers && data.slideCount > 1){
				data.main.append('<div class="' + cfg.classMarkers + '"></div>');
				for( let i = 0; i < data.slideCount; i++){
					if(i == 0){
						data.main.find('.' + cfg.classMarkers).append('<div class="' + cfg.classMarker + ' ' + cfg.classActiveMarker + '">' + cfg.iconMarker + '</div>');
					}
					else{
						data.main.find('.' + cfg.classMarkers).append('<div class="' + cfg.classMarker + '">' + cfg.iconMarker + '</div>');
					}
				}
			}
			
			// Если showArrows = true добавляем стрелки.
			if(cfg.showArrows && data.slideCount > 1){
				data.main.append('<div class="' + cfg.classPrevArrow + '">' + cfg.iconPrevArrow + '</div>');
				data.main.append('<div class="' + cfg.classNextArrow + '">' + cfg.iconNextArrow + '</div>');
			}
		}
		

		// Навигация по слайдам
		// --------------------------------------------------------------------------------------------------------------
		
		// Изменяемая переменная для задержки автослистывания после действия.
		var statusAutoSlide = true;
		
		// Если showArrows = true добавляем события на стрелки.
		if(cfg.showArrows && data.slideCount > 1){
			
			// При нажатии на стрелку "Next".
			data.main.find('.' + cfg.classNextArrow).click(function(event){
				
				// Определяем индекс активного слайда.
				var сurrentSlide = data.main.find('.' + cfg.classSlide + '.' + cfg.classActiveSlide);
				var indexCurrentSlide = сurrentSlide.index();
				
				// Получаем следующий слайд.
				if(indexCurrentSlide < data.slideCount - 1){
					var nextSlide = data.main.find('.' + cfg.classSlide).eq(indexCurrentSlide + 1);
				}
				else{
					var nextSlide = data.main.find('.' + cfg.classSlide).eq(0);
				}
				
				// Проверяем тип анимации слистывания слайдов.
				if(cfg.animationSlide == 'horizontal'){
					
					// Сбрасываем transition у слайдов.
					data.slide.css('transition','all 0ms ease');
					
					setTimeout( function() {
						nextSlide.css('transform','translateX(100%)');
						сurrentSlide.css('transform','translateX(0%)');
					}, 20);
					
					// Добавляем transition слайдам которые будем анимировать.
					setTimeout( function() {
						nextSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
						сurrentSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
					}, 40);
					
					// Анимируем слайды.
					setTimeout( function() {
						nextSlide.css('transform','translateX(0%)');
						сurrentSlide.css('transform','translateX(-100%)');
					}, 60);
				}
				else if(cfg.animationSlide == 'vertical'){
					// Сбрасываем transition у слайдов.
					data.slide.css('transition','all 0ms ease');
					
					setTimeout( function() {
						nextSlide.css('transform','translateX(0%) translateY(100%)');
						сurrentSlide.css('transform','translateX(0%) translateY(0%)');
					}, 20);
					
					// Добавляем transition слайдам которые будем анимировать.
					setTimeout( function() {
						nextSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
						сurrentSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
					}, 40);
					
					// Анимируем слайды.
					setTimeout( function() {
						nextSlide.css('transform','translateX(0%) translateY(0%)');
						сurrentSlide.css('transform','translateX(0%) translateY(-100%)');
					}, 60);
				}
				else if(cfg.animationSlide == 'appearance'){
					// Сбрасываем transition у слайдов.
					data.slide.css('transition','all 0ms ease');

					setTimeout( function() {
						nextSlide.css('transform','translateX(0%) translateY(0%)');
						nextSlide.css('opacity','0');
						сurrentSlide.css('transform','translateX(0%) translateY(0%)');
						сurrentSlide.css('opacity','1');
					}, 20);
					
					// Добавляем transition слайдам которые будем анимировать.
					setTimeout( function() {
						nextSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
						сurrentSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
					}, 40);
					
					// Анимируем слайды.
					setTimeout( function() {
						nextSlide.css('transform','translateX(0%) translateY(0%)');
						nextSlide.css('opacity','1');
						сurrentSlide.css('transform','translateX(0%) translateY(0%)');
						сurrentSlide.css('opacity','0');
					}, 60);
				}
				
				// Переключаем активные классы слайдов.
				data.main.find('.' + cfg.classSlide).removeClass(cfg.classActiveSlide);
				nextSlide.addClass(cfg.classActiveSlide);
				
				// Переключаем активные классы маркеров.
				data.main.find('.' + cfg.classMarker).removeClass(cfg.classActiveMarker);
				data.main.find('.' + cfg.classMarkers).find('.' + cfg.classMarker).eq(nextSlide.index()).addClass(cfg.classActiveMarker);
				
				// Устанавлеваем задержку на автослистывание слайдов.
				statusAutoSlide = false;
				setTimeout( function() {
					statusAutoSlide = true;
				}, cfg.actionShowTime);
			});
			
			// При нажатии на стрелку "Perv".
			data.main.find('.' + cfg.classPrevArrow).click(function(event){
				
				// Определяем индекс активного слайда.
				var сurrentSlide = data.main.find('.' + cfg.classSlide + '.' + cfg.classActiveSlide);
				var indexCurrentSlide = сurrentSlide.index();
				
				// Получаем предыдущий слайд.
				if(indexCurrentSlide > 0){
					var nextSlide = data.main.find('.' + cfg.classSlide).eq(indexCurrentSlide - 1);
				}
				else{
					var nextSlide = data.main.find('.' + cfg.classSlide).eq(data.slideCount - 1);
				}
				
				// Проверяем тип анимации слистывания слайдов.
				if(cfg.animationSlide == 'horizontal'){
					
					// Сбрасываем transition у слайдов.
					data.slide.css('transition','all 0ms ease');
					
					setTimeout( function() {
						nextSlide.css('transform','translateX(-100%)');
						сurrentSlide.css('transform','translateX(0%)');
					}, 20);
					
					// Добавляем transition слайдам которые будем анимировать.
					setTimeout( function() {
						nextSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
						сurrentSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
					}, 40);
					
					// Анимируем слайды.
					setTimeout( function() {
						nextSlide.css('transform','translateX(0%)');
						сurrentSlide.css('transform','translateX(100%)');
					}, 60);
				}
				else if(cfg.animationSlide == 'vertical'){
					
					// Сбрасываем transition у слайдов.
					data.slide.css('transition','all 0ms ease');
					
					setTimeout( function() {
						nextSlide.css('transform','translateX(0%) translateY(-100%)');
						сurrentSlide.css('transform','translateX(0%) translateY(0%)');
					}, 20);
					
					// Добавляем transition слайдам которые будем анимировать.
					setTimeout( function() {
						nextSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
						сurrentSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
					}, 40);
					
					// Анимируем слайды.
					setTimeout( function() {
						nextSlide.css('transform','translateX(0%) translateY(0%)');
						сurrentSlide.css('transform','translateX(0%) translateY(100%)');
					}, 60);
				}
				else if(cfg.animationSlide == 'appearance'){
					// Сбрасываем transition у слайдов.
					data.slide.css('transition','all 0ms ease');

					setTimeout( function() {
						nextSlide.css('transform','translateX(0%) translateY(0%)');
						nextSlide.css('opacity','0');
						сurrentSlide.css('transform','translateX(0%) translateY(0%)');
						сurrentSlide.css('opacity','1');
					}, 20);
					
					// Добавляем transition слайдам которые будем анимировать.
					setTimeout( function() {
						nextSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
						сurrentSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
					}, 40);
					
					// Анимируем слайды.
					setTimeout( function() {
						nextSlide.css('transform','translateX(0%) translateY(0%)');
						nextSlide.css('opacity','1');
						сurrentSlide.css('transform','translateX(0%) translateY(0%)');
						сurrentSlide.css('opacity','0');
					}, 60);
				}
				
				// Переключаем активные классы слайдов.
				data.main.find('.' + cfg.classSlide).removeClass(cfg.classActiveSlide);
				nextSlide.addClass(cfg.classActiveSlide);
				
				// Переключаем активные классы маркеров.
				data.main.find('.' + cfg.classMarker).removeClass(cfg.classActiveMarker);
				data.main.find('.' + cfg.classMarkers).find('.' + cfg.classMarker).eq(nextSlide.index()).addClass(cfg.classActiveMarker);

				// Устанавлеваем задержку на автослистывание слайдов.
				statusAutoSlide = false;
				setTimeout( function() {
					statusAutoSlide = true;
				}, cfg.actionShowTime);
			});
			
		}
		
		// Если showMarkers = true добавляем события на маркеры.
		if(cfg.showMarkers && data.slideCount > 1){
			
			// При нажатии на маркер.
			data.main.find('.' + cfg.classMarker).click(function(event){
				
				// Определяем индекс активного слайда.
				var сurrentSlide = data.main.find('.' + cfg.classSlide + '.' + cfg.classActiveSlide);
				var indexCurrentSlide = сurrentSlide.index();
				
				// Определяем индекс следующего слайда.
				var nextSlide = data.main.find('.' + cfg.classSlide).eq($(this).index());
				var indexNextSlide = $(this).index();
				
				if(indexNextSlide > indexCurrentSlide){
					
					// Проверяем тип анимации слистывания слайдов.
					if(cfg.animationSlide == 'horizontal'){
						
						// Сбрасываем transition у слайдов.
						data.slide.css('transition','all 0ms ease');
						
						setTimeout( function() {
							nextSlide.css('transform','translateX(100%)');
							сurrentSlide.css('transform','translateX(0%)');
						}, 20);
						
						// Добавляем transition слайдам которые будем анимировать.
						setTimeout( function() {
							nextSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
							сurrentSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
						}, 40);
						
						// Анимируем слайды.
						setTimeout( function() {
							nextSlide.css('transform','translateX(0%)');
							сurrentSlide.css('transform','translateX(-100%)');
						}, 60);
					}
					else if(cfg.animationSlide == 'vertical'){
						
						// Сбрасываем transition у слайдов.
						data.slide.css('transition','all 0ms ease');
						
						setTimeout( function() {
							nextSlide.css('transform','translateX(0%) translateY(100%)');
							сurrentSlide.css('transform','translateX(0%) translateY(0%)');
						}, 20);
						
						// Добавляем transition слайдам которые будем анимировать.
						setTimeout( function() {
							nextSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
							сurrentSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
						}, 40);
						
						// Анимируем слайды.
						setTimeout( function() {
							nextSlide.css('transform','translateX(0%) translateY(0%)');
							сurrentSlide.css('transform','translateX(0%) translateY(-100%)');
						}, 60);
					}
					else if(cfg.animationSlide == 'appearance'){
						
						// Сбрасываем transition у слайдов.
						data.slide.css('transition','all 0ms ease');
						
						setTimeout( function() {
							nextSlide.css('transform','translateX(0%) translateY(0%)');
							nextSlide.css('opacity','0');
							сurrentSlide.css('transform','translateX(0%) translateY(0%)');
							сurrentSlide.css('opacity','1');
						}, 20);
						
						// Добавляем transition слайдам которые будем анимировать.
						setTimeout( function() {
							nextSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
							сurrentSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
						}, 40);
						
						// Анимируем слайды.
						setTimeout( function() {
							nextSlide.css('transform','translateX(0%) translateY(0%)');
							nextSlide.css('opacity','1');
							сurrentSlide.css('transform','translateX(0%) translateY(0%)');
							сurrentSlide.css('opacity','0');
						}, 60);
					}
				}
				else{
					// Проверяем тип анимации слистывания слайдов.
					if(cfg.animationSlide == 'horizontal'){
						
						// Сбрасываем transition у слайдов.
						data.slide.css('transition','all 0ms ease');
						
						setTimeout( function() {
							nextSlide.css('transform','translateX(-100%)');
							сurrentSlide.css('transform','translateX(0%)');
						}, 20);
						
						// Добавляем transition слайдам которые будем анимировать.
						setTimeout( function() {
							nextSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
							сurrentSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
						}, 40);
						
						// Анимируем слайды.
						setTimeout( function() {
							nextSlide.css('transform','translateX(0%)');
							сurrentSlide.css('transform','translateX(100%)');
						}, 60);
					}
					else if(cfg.animationSlide == 'vertical'){
						
						// Сбрасываем transition у слайдов.
						data.slide.css('transition','all 0ms ease');
						
						setTimeout( function() {
							nextSlide.css('transform','translateX(0%) translateY(-100%)');
							сurrentSlide.css('transform','translateX(0%) translateY(0%)');
						}, 20);
						
						// Добавляем transition слайдам которые будем анимировать.
						setTimeout( function() {
							nextSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
							сurrentSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
						}, 40);
						
						// Анимируем слайды.
						setTimeout( function() {
							nextSlide.css('transform','translateX(0%) translateY(0%)');
							сurrentSlide.css('transform','translateX(0%) translateY(100%)');
						}, 60);
					}
					else if(cfg.animationSlide == 'appearance'){
						
						// Сбрасываем transition у слайдов.
						data.slide.css('transition','all 0ms ease');
						
						setTimeout( function() {
							nextSlide.css('transform','translateX(0%) translateY(0%)');
							nextSlide.css('opacity','0');
							сurrentSlide.css('transform','translateX(0%) translateY(0%)');
							сurrentSlide.css('opacity','1');
						}, 20);
						
						// Добавляем transition слайдам которые будем анимировать.
						setTimeout( function() {
							nextSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
							сurrentSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
						}, 40);
						
						// Анимируем слайды.
						setTimeout( function() {
							nextSlide.css('transform','translateX(0%) translateY(0%)');
							nextSlide.css('opacity','1');
							сurrentSlide.css('transform','translateX(0%) translateY(0%)');
							сurrentSlide.css('opacity','0');
						}, 60);
					}
				}
				
				// Переключаем активные классы слайдов.
				data.main.find('.' + cfg.classSlide).removeClass(cfg.classActiveSlide);
				nextSlide.addClass(cfg.classActiveSlide);
				
				// Переключаем активные классы маркеров.
				data.main.find('.' + cfg.classMarker).removeClass(cfg.classActiveMarker);
				$(this).addClass(cfg.classActiveMarker);
				
				// Устанавлеваем задержку на автослистывание слайдов.
				statusAutoSlide = false;
				setTimeout( function() {
					statusAutoSlide = true;
				}, cfg.actionShowTime);
			});
		}
		
		// Если автослистывание слайдов включено.
		if(cfg.autoSlide && data.slideCount > 1){
			
			// Изменяемая переменная для возобновления автослистывания слайдов.
			var allowAutoSlide = true;
			
			// Проверяем задержку после действия в навигации.
			setInterval(function(){
				if(statusAutoSlide){
					allowAutoSlide = true;
				}
				else{
					allowAutoSlide = false;
				}
			}, 100);
			
			// Слистываем слайды по окончанию задержки после действия в навигации.
			setInterval(function(){
				if(allowAutoSlide){
					
					// Определяем индекс активного слайда.
					var сurrentSlide = data.main.find('.' + cfg.classSlide + '.' + cfg.classActiveSlide);
					var indexCurrentSlide = сurrentSlide.index();
					
					// Получаем следующий слайд.
					if(indexCurrentSlide < data.slideCount - 1){
						var nextSlide = data.main.find('.' + cfg.classSlide).eq(indexCurrentSlide + 1);
					}
					else{
						var nextSlide = data.main.find('.' + cfg.classSlide).eq(0);
					}
					
					// Проверяем тип анимации слистывания слайдов.
					if(cfg.animationSlide == 'horizontal'){
						
						// Сбрасываем transition у слайдов.
						data.slide.css('transition','all 0ms ease');
						
						setTimeout( function() {
							nextSlide.css('transform','translateX(100%)');
							сurrentSlide.css('transform','translateX(0%)');
						}, 20);
						
						// Добавляем transition слайдам которые будем анимировать.
						setTimeout( function() {
							nextSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
							сurrentSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
						}, 40);
						
						// Анимируем слайды.
						setTimeout( function() {
							nextSlide.css('transform','translateX(0%)');
							сurrentSlide.css('transform','translateX(-100%)');
						}, 60);
					}
					else if(cfg.animationSlide == 'vertical'){
						// Сбрасываем transition у слайдов.
						data.slide.css('transition','all 0ms ease');
						
						setTimeout( function() {
							nextSlide.css('transform','translateX(0%) translateY(100%)');
							сurrentSlide.css('transform','translateX(0%) translateY(0%)');
						}, 20);
						
						// Добавляем transition слайдам которые будем анимировать.
						setTimeout( function() {
							nextSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
							сurrentSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
						}, 40);
						
						// Анимируем слайды.
						setTimeout( function() {
							nextSlide.css('transform','translateX(0%) translateY(0%)');
							сurrentSlide.css('transform','translateX(0%) translateY(-100%)');
						}, 60);
					}
					else if(cfg.animationSlide == 'appearance'){
						// Сбрасываем transition у слайдов.
						data.slide.css('transition','all 0ms ease');

						setTimeout( function() {
							nextSlide.css('transform','translateX(0%) translateY(0%)');
							nextSlide.css('opacity','0');
							сurrentSlide.css('transform','translateX(0%) translateY(0%)');
							сurrentSlide.css('opacity','1');
						}, 20);
						
						// Добавляем transition слайдам которые будем анимировать.
						setTimeout( function() {
							nextSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
							сurrentSlide.css('transition','all ' + cfg.animationTimeSlide + 'ms ease');
						}, 40);
						
						// Анимируем слайды.
						setTimeout( function() {
							nextSlide.css('transform','translateX(0%) translateY(0%)');
							nextSlide.css('opacity','1');
							сurrentSlide.css('transform','translateX(0%) translateY(0%)');
							сurrentSlide.css('opacity','0');
						}, 60);
					}
					
					// Переключаем активные классы слайдов.
					data.main.find('.' + cfg.classSlide).removeClass(cfg.classActiveSlide);
					nextSlide.addClass(cfg.classActiveSlide);
					
					// Переключаем активные классы маркеров.
					data.main.find('.' + cfg.classMarker).removeClass(cfg.classActiveMarker);
					data.main.find('.' + cfg.classMarkers).find('.' + cfg.classMarker).eq(nextSlide.index()).addClass(cfg.classActiveMarker);
					
				}
			}, cfg.showTime);
			
		}
		
		
    }

})(jQuery);
