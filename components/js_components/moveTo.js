// ---------------------------------------------------------------------------------------------------------------
// Для елемента який ми хочемо перемістити, потрібно вказати data-move=".клас блоку куди потрібно перемістити" 
// і data-breakpoint="брекпоїнт в пікселях до якого має спрацьовувати типу max-width"
// ---------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------
export function moveElements() {
    // Додаємо подію, що виконується після завантаження всього контенту сторінки
    document.addEventListener('DOMContentLoaded', function () {
        console.log("moveElements готовий до роботи при запуску сторінки");

        // Знаходимо всі елементи, що мають атрибут 'data-move'
        const movedElements = document.querySelectorAll('[data-move]');
        // Використовуємо WeakMap для збереження початкових контейнерів елементів
        const originalContainers = new WeakMap();
        // Використовуємо WeakMap для збереження початкових індексів елементів у їхніх контейнерах
        const originalIndexes = new WeakMap();

        // Виводимо повідомлення, якщо не знайдено жодного елемента для переміщення
        if (movedElements.length === 0) {
            console.log("Не знайдено жодного елемента з атрибутом 'data-move'");
        }

        // Проходимося по кожному елементу, що потребує переміщення
        movedElements.forEach((element) => {
            // Отримуємо селектор цільового контейнера з атрибута 'data-move'
            const targetSelector = element.getAttribute('data-move');
            // Отримуємо значення брейкпойнта з атрибута 'data-breakpoint'
            const breakpoint = parseInt(element.getAttribute('data-breakpoint'), 10);

            // Перевіряємо наявність коректного селектора цільового контейнера
            if (!targetSelector) {
                console.log(`Елемент (${element.className}) не має коректного атрибута 'data-move'`);
                return;
            }

            // Перевіряємо наявність коректного значення брейкпойнта
            if (isNaN(breakpoint)) {
                console.log(`Елемент (${element.className}) не має коректного атрибута 'data-breakpoint'`);
                return;
            }

            // Зберігаємо початковий контейнер елемента
            const parent = element.parentNode;
            originalContainers.set(element, parent);
            // Зберігаємо початковий індекс елемента в його контейнері
            originalIndexes.set(element, Array.from(parent.children).indexOf(element));

            // Функція, що переміщує елемент залежно від ширини вікна
            const moveElement = () => {
                console.log(`Перевірка ширини вікна для елемента (${element.className}): ${window.innerWidth}px <= ${breakpoint}px`);
                if (window.innerWidth <= breakpoint) {
                    // Знаходимо цільовий контейнер
                    const targetContainer = document.querySelector(targetSelector);
                    if (targetContainer) {
                        targetContainer.appendChild(element);
                        console.log(`Елемент (${element.className}) переміщено в (${targetContainer.className})`);
                    } else {
                        console.log(`Цільовий контейнер не знайдено для селектора (${targetSelector})`);
                    }
                } else {
                    // Повертаємо елемент у початковий контейнер
                    const originalContainer = originalContainers.get(element);
                    const originalIndex = originalIndexes.get(element);
                    if (originalContainer) {
                        const referenceNode = originalContainer.children[originalIndex];
                        // Повертаємо елемент на його початкову позицію або в кінець контейнера, якщо початкового вузла більше не існує
                        if (referenceNode) {
                            originalContainer.insertBefore(element, referenceNode);
                        } else {
                            originalContainer.appendChild(element);
                        }
                        console.log(`Елемент (${element.className}) повернено в початковий контейнер (${originalContainer.className})`);
                    }
                }
            };

            // Додаємо подію зміни розміру вікна, що викликає функцію moveElement
            window.addEventListener('resize', moveElement);
            // Викликаємо функцію moveElement для початкового розміщення елементів
            moveElement();
        });
    });
}
// ---------------------------------------------------------------------------------------------------------------


// ---------------------------------------------------------------------------------------------------------------
export default moveElements;
// ---------------------------------------------------------------------------------------------------------------
