const { createApp, ref, computed, onMounted, nextTick } = Vue;

createApp({
    setup() {
        // Reactive data
        const values = ref([]);
        const draggingIndex = ref(null);
        const dragOverIndex = ref(null);

        const toasts = ref([]);
        const valuesList = ref(null);

        // Initial values from the requirements
        const initialValues = [
            'Miłość', 'Balans', 'Energia', 'Akceptacja', 'Harmonia', 'Satysfakcja',
            'Zaufanie', 'Intuicja', 'Radość', 'Wiara', 'Motywacja', 'Szczęście',
            'Zdrowie', 'Pasja', 'Bogactwo', 'Piękno', 'Niezależność', 'Dostatek',
            'Intymność', 'Elastyczność', 'Sukces', 'Spokój', 'Wolność', 'Perfekcjonizm',
            'Szczerość', 'Zaangażowanie', 'Mądrość', 'Stabilność Finansowa', 'Wdzięczność',
            'Wygoda', 'Rozwój osobisty', 'Wsparcie', 'Dobra zabawa', 'Wykształcenie',
            'Wrażliwość', 'Humor', 'Kreatywność', 'Wyobraźnia', 'Marzenia', 'Bezpieczeństwo',
            'Komfort', 'Transcendencja', 'Pewność', 'Sprawiedliwość', 'Lojalność',
            'Duma', 'Przygoda', 'Ryzyko', 'Wyzwania', 'Autentyczność', 'Odwaga',
            'Oryginalność', 'Szacunek', 'Otwartość', 'Pokój', 'Uczciwość',
            'Uczenie się', 'Duchowość', 'Fair-play', 'Prawda', 'Inicjatywa',
            'Innowacyjność', 'Przyjaźń', 'Jakość', 'Współpraca', 'Siła',
            'Skuteczność', 'Spełnienie', 'Zręczność', 'Odpowiedzialność'
        ];

        // Remove duplicates and take first 40
        const uniqueValues = [...new Set(initialValues)].slice(0, 40);

        // Computed properties
        const progress = computed(() => {
            if (values.value.length === 0) return 0;
            
            // Calculate progress based on how many values have been "properly positioned"
            // We consider a value properly positioned if it has been moved from its initial position
            let movedValues = 0;
            for (let i = 0; i < values.value.length; i++) {
                const value = values.value[i];
                const initialIndex = uniqueValues.indexOf(value.name);
                if (i !== initialIndex) {
                    movedValues++;
                }
            }
            
            // Additional progress for having top 7 values in reasonable positions
            let topValuesBonus = 0;
            for (let i = 0; i < Math.min(7, values.value.length); i++) {
                if (i !== uniqueValues.indexOf(values.value[i].name)) {
                    topValuesBonus += 2; // Extra weight for top positions
                }
            }
            
            return Math.min(100, (movedValues * 1.5 + topValuesBonus) / values.value.length * 100);
        });

        // Initialize values
        const initializeValues = () => {
            values.value = uniqueValues.map((name, index) => ({
                id: `value_${index}`,
                name,
                originalIndex: index
            }));
        };

        // Load from localStorage
        const loadFromStorage = () => {
            try {
                const stored = localStorage.getItem('eliminacja-wartosci');
                if (stored) {
                    const parsedValues = JSON.parse(stored);
                    if (Array.isArray(parsedValues) && parsedValues.length > 0) {
                        values.value = parsedValues;
                        showToast('Wczytano zapisane wartości', 'success');
                        return;
                    }
                }
            } catch (error) {
                console.error('Error loading from storage:', error);
            }
            initializeValues();
        };

        // Save to localStorage
        const saveToStorage = () => {
            try {
                localStorage.setItem('eliminacja-wartosci', JSON.stringify(values.value));
            } catch (error) {
                console.error('Error saving to storage:', error);
                showToast('Błąd podczas zapisywania', 'error');
            }
        };

        // Toast notifications
        const showToast = (message, type = 'info') => {
            const toast = {
                id: Date.now(),
                message,
                type
            };
            toasts.value.push(toast);
            
            setTimeout(() => {
                const index = toasts.value.findIndex(t => t.id === toast.id);
                if (index > -1) {
                    toasts.value.splice(index, 1);
                }
            }, 3000);
        };

        const getToastIcon = (type) => {
            const icons = {
                success: 'fas fa-check-circle',
                error: 'fas fa-exclamation-circle',
                info: 'fas fa-info-circle'
            };
            return icons[type] || icons.info;
        };



        const moveToPosition = (fromIndex, toIndex) => {
            if (fromIndex === toIndex) return;
            
            const newValues = [...values.value];
            const item = newValues.splice(fromIndex, 1)[0];
            newValues.splice(toIndex, 0, item);
            values.value = newValues;
            saveToStorage();
        };

        // Drag and Drop
        const dragStart = (index, event) => {
            draggingIndex.value = index;
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/html', event.target.outerHTML);
            
            // Add visual feedback class
            nextTick(() => {
                if (valuesList.value) {
                    valuesList.value.classList.add('dragging');
                }
            });
        };

        const dragOver = (index, event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
            
            if (draggingIndex.value !== null && draggingIndex.value !== index) {
                dragOverIndex.value = index;
                updateDragVisualFeedback(index);
            }
        };

        const updateDragVisualFeedback = (targetIndex) => {
            const items = valuesList.value?.querySelectorAll('.value-item');
            if (!items) return;

            items.forEach((item, index) => {
                item.classList.remove('shift-up', 'shift-down', 'drag-over');
                
                if (index === targetIndex) {
                    item.classList.add('drag-over');
                } else if (draggingIndex.value !== null) {
                    if (draggingIndex.value < targetIndex && index > draggingIndex.value && index <= targetIndex) {
                        item.classList.add('shift-up');
                    } else if (draggingIndex.value > targetIndex && index < draggingIndex.value && index >= targetIndex) {
                        item.classList.add('shift-down');
                    }
                }
            });
        };

        const drop = (index, event) => {
            event.preventDefault();
            
            if (draggingIndex.value !== null && draggingIndex.value !== index) {
                moveToPosition(draggingIndex.value, index);
            }
            
            dragEnd();
        };

        const dragEnd = () => {
            draggingIndex.value = null;
            dragOverIndex.value = null;
            
            // Remove visual feedback classes
            if (valuesList.value) {
                valuesList.value.classList.remove('dragging');
                const items = valuesList.value.querySelectorAll('.value-item');
                items.forEach(item => {
                    item.classList.remove('shift-up', 'shift-down', 'drag-over');
                });
            }
        };



        // CSV Export
        const exportCSV = () => {
            try {
                const csvContent = 'Pozycja,Wartość\n' + 
                    values.value.map((value, index) => `${index + 1},"${value.name}"`).join('\n');
                
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                
                if (link.download !== undefined) {
                    const url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', `eliminacja-wartosci-${new Date().toISOString().split('T')[0]}.csv`);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    showToast('Plik CSV został wyeksportowany', 'success');
                }
            } catch (error) {
                console.error('Export error:', error);
                showToast('Błąd podczas eksportu pliku CSV', 'error');
            }
        };

        // CSV Import
        const importCSV = (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target.result;
                    const lines = content.split('\n');
                    const importedValues = [];
                    
                    // Skip header row
                    for (let i = 1; i < lines.length; i++) {
                        const line = lines[i].trim();
                        if (line) {
                            const match = line.match(/^\d+,"?([^"]*)"?$/);
                            if (match && match[1]) {
                                importedValues.push({
                                    id: `imported_${i}`,
                                    name: match[1].trim(),
                                    originalIndex: i - 1
                                });
                            }
                        }
                    }
                    
                    if (importedValues.length > 0) {
                        values.value = importedValues;
                        saveToStorage();
                        showToast(`Zaimportowano ${importedValues.length} wartości`, 'success');
                    } else {
                        showToast('Nie znaleziono poprawnych danych w pliku CSV', 'error');
                    }
                } catch (error) {
                    console.error('Import error:', error);
                    showToast('Błąd podczas importu pliku CSV', 'error');
                }
            };
            
            reader.readAsText(file);
            // Clear the input
            event.target.value = '';
        };

        // Utility functions
        const resetValues = () => {
            if (confirm('Czy na pewno chcesz zresetować listę do początkowych wartości?')) {
                initializeValues();
                saveToStorage();
                showToast('Lista została zresetowana', 'info');
            }
        };

        const shuffleValues = () => {
            if (confirm('Czy na pewno chcesz wylosować kolejność wartości?')) {
                const shuffled = [...values.value];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                values.value = shuffled;
                saveToStorage();
                showToast('Lista została wylosowana', 'info');
            }
        };

        const getValueStyle = (index) => {
            if (draggingIndex.value === index) {
                return {
                    transform: 'rotate(5deg) scale(1.05)',
                    zIndex: 1000,
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                };
            }
            return {};
        };

        // Lifecycle
        onMounted(() => {
            loadFromStorage();
        });



        return {
            values,
            draggingIndex,
            toasts,
            valuesList,
            progress,
            dragStart,
            dragOver,
            dragEnd,
            drop,
            exportCSV,
            importCSV,
            resetValues,
            shuffleValues,
            getValueStyle,
            getToastIcon,
            showToast
        };
    }
}).mount('#app');
