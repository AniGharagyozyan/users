document.addEventListener("DOMContentLoaded", () => {
  let page = 1;
  const perPage = 10;
  let totalPages = 1;
  let localUsers = JSON.parse(localStorage.getItem("users")) || [];
  let allUsers = [];

  function isValidEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email); 
// $ - конец строки   test(email) - stuguma hamapatasxanuma te che ayd shablonin u true or falsea te che
  }

// Назначение функции showPage(data, validateEmail = false)
// Показывает таблицу пользователей на странице.
// Добавляет предпросмотр введённого вручную пользователя (до сохранения).
// Валидирует email при необходимости.
// Показывает фото пользователя или плейсхолдер, если фото нет.
// Переключает страницу с пагинацией.



  function showPage(data, validateEmail = false) {
//data — массив пользователей, которые нужно отобразить.
// validateEmail — логическое значение (true/false), нужно ли подсвечивать неправильный email.
    let html =
// Создаёт заголовок таблицы с колонками:Id, Photo, Name, Email, Gender, Status 
      '<table border="1"><tr><th>Id</th><th>Photo</th><th>Name</th><th>Email</th><th>Gender</th><th>Status</th></tr>';



// Считывает данные из полей формы. Если хотя бы одно поле заполнено — добавит первую строку с этими значениями (как live-превью перед добавлением).
    const previewId = document.getElementById("userId")?.value.trim(); // ? безопасно проверяет, существует ли найденный элемент.
// Если элемент не найден (null), дальше код не выполняется, и результатом будет undefined, а не ошибка. trim() удаляет пробелы в начале и конце строки.
    const previewName = document.getElementById("name")?.value.trim();
    const previewEmail = document.getElementById("email")?.value.trim();
    const previewGender = document.getElementById("gender")?.value.trim();
    const previewStatus = document.getElementById("status")?.value.trim();



    if (
      previewId ||
      previewName ||
      previewEmail ||
      previewGender ||
      previewStatus
    ) {


//Если email заполнен и некорректный — подсвечивает его красным (#ffdddd), но только если validateEmail === true.
      let emailCellStyle = "";
      if (previewEmail && !isValidEmail(previewEmail) && validateEmail) {
        emailCellStyle = "background-color:#ffdddd;";
      }


// Пока фото нет, ничего не показываем
      let photoHtml = ""; // Или: '<img src="..." ...>' если хочешь preview фото показать

      html += `<tr>
      <td>${previewId || " "}</td>
      <td>${photoHtml}</td>
      <td>${previewName || " "}</td>
      <td style="${emailCellStyle}">${previewEmail || " "}</td>
      <td>${previewGender || " "}</td>
      <td>${previewStatus || " "}</td>
    </tr>`;
    }


// Отображение пользователей из data: Если email корректный — показываем, иначе оставляем пустым (и ячейка будет красной).
    data.forEach((u) => {
      let emailToShow = isValidEmail(u.email) ? u.email : "";
      let photoHtml = u.photo
        ? `<img src="${u.photo}" width="40" height="40" style="object-fit:cover; border-radius:4px;">`
        : `<img src="https://via.placeholder.com/40?text=👤" width="40" height="40" style="object-fit:cover; border-radius:4px;">`;
// Если у пользователя есть photo, отображается оно.
// Если нет — используется плейсхолдер с аватаркой.



// Добавление preview строки в таблицу:Добавляется новая строка с данными, если хотя бы одно поле заполнено.
// Если email некорректный — ячейка подсвечена.
      html += `<tr>
      <td>${u.id}</td>
      <td>${photoHtml}</td>
      <td>${u.name}</td>
      <td style="color:${emailToShow ? "black" : "red"}">${emailToShow}</td>
      <td>${u.gender}</td>
      <td>${u.status}</td>
    </tr>`;
    });
    html += "</table>"; // Завершение таблицы:

    document.getElementById("out").innerHTML = html; // Результат вставляется в контейнер с id="out".
    document.getElementById("page").textContent = page; // Номер текущей страницы обновляется

    renderPagination();
// Вызывает внешнюю функцию renderPagination() — она отвечает за отображение кнопок «вперёд / назад / номера страниц».
  }


// Эта функция создаёт кнопки пагинации (1, 2, ..., N), чтобы можно было переключать страницы пользователей в таблице.
// Создаёт HTML-кнопки для каждой страницы.
// Отмечает текущую страницу жирным.
// Скрывает лишние номера при большом количестве страниц с помощью ....


  function renderPagination() {

// Получаем контейнер для кнопок: Ищем на странице элемент с id="pages", куда будем вставлять HTML с кнопками.
    const pagesContainer = document.getElementById("pages");
// Здесь будет накапливаться HTML разметка для кнопок.
    let html = "";
  
// Функция создания кнопки:
    function makeBtn(p) {
      return `<button onclick="goToPage(${p})" style="margin:2px;${
        p === page ? "font-weight:bold;" : ""
      }">${p}</button>`;
    }
// ${p}: Это часть синтаксиса "template literals" (шаблонных литералов) в JavaScript. 
// $ { ... } позволяет вставлять значения переменных в строку. 
// В данном случае, значение переменной p будет вставлено в строку в качестве аргумента для функции goToPage.

// Принимает номер страницы p.
// Возвращает HTML-кнопку.
// Если p совпадает с текущей страницей (page), кнопка делается жирной (font-weight: bold).
// У каждой кнопки обработчик onclick="goToPage(p)", который вызывает переход на выбранную страницу.


    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) html += makeBtn(i);
    } else {
      html += makeBtn(1);
      html += makeBtn(2);
      if (page > 5) html += '<span style="margin:2px; color:gray;">...</span>';
      for (let i = page - 2; i <= page + 2; i++) {
        if (i > 2 && i < totalPages - 1) html += makeBtn(i);
      }
      if (page < totalPages - 4)
        html += '<span style="margin:2px; color:gray;">...</span>';
      html += makeBtn(totalPages - 1);
      html += makeBtn(totalPages);
    }
    pagesContainer.innerHTML = html;
  }

  // Функция перехода на страницу
  window.goToPage = function (p) {
    if (p < 1 || p > totalPages) return;
    page = p;
    showPage(allUsers.slice((page - 1) * perPage, page * perPage));
    renderPagination();
  };

  // Кнопки Prev и Next
  document.getElementById("prev").onclick = () => {
    if (page > 1) {
      page--;
      showPage(allUsers.slice((page - 1) * perPage, page * perPage));
      renderPagination();
    }
  };

  document.getElementById("next").onclick = () => {
    if (page < totalPages) {
      page++;
      showPage(allUsers.slice((page - 1) * perPage, page * perPage));
      renderPagination();
    }
  };

  async function fetchData() {
    try {
      localUsers = JSON.parse(localStorage.getItem("users")) || [];
      const perPageApi = 100;
      const totalPagesToLoad = 5;
      let apiUsers = [];

      for (let i = 1; i <= totalPagesToLoad; i++) {
        const res = await fetch(
          `https://gorest.co.in/public/v2/users?page=${i}&per_page=${perPageApi}`
        );
        if (!res.ok) throw new Error("Ошибка HTTP: " + res.status);
        const data = await res.json();

        // ✅ Добавляем поле photo, если его нет, подставляем заглушку
        const usersWithPhotos = data.map((user) => ({
          ...user,
          photo: user.photo || "https://placehold.co/600x400",
        }));

        apiUsers.push(...usersWithPhotos);
      }

      allUsers = [...localUsers, ...apiUsers];
      console.log("All users (local + API):", allUsers);
      totalPages = Math.ceil(allUsers.length / perPage);
      showPage(allUsers.slice((page - 1) * perPage, page * perPage));
      renderPagination();
    } catch (error) {
      alert("Ошибка при загрузке данных: " + error.message);
      console.error(error);
    }
  }

  // Кнопка загрузки данных с API
  document.getElementById("btn").onclick = () => {
    page = 1;
    fetchData();
  };

  // Добавление нового пользователя
  document.getElementById("addRowBtn").addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const gender = document.getElementById("gender").value.trim();
    const status = document.getElementById("status").value.trim();
    const id = document.getElementById("userId").value.trim();
    const photoFile = document.getElementById("photo").files[0];

    if (!name || !email || !gender || !status || !id) {
      alert("Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Not valid email");
      document.getElementById("email").style.border = "2px solid red";
      document.getElementById("email").value = "";
      return;
    }

    // если фото загружено
    if (photoFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const newUser = {
          id,
          name,
          email,
          gender,
          status,
          photo: e.target.result,
        };

        localUsers.unshift(newUser);
        localStorage.setItem("users", JSON.stringify(localUsers));
        allUsers.unshift(newUser);

        showPage(allUsers.slice(0, 10));
        renderPagination();

        clearInputs();
      };
      reader.readAsDataURL(photoFile);
    } else {
      // ❗ фото не загружено → ставим заглушку
      const placeholder = "https://via.placeholder.com/40?text=👤";
      const newUser = { id, name, email, gender, status, photo: placeholder };

      localUsers.unshift(newUser);
      localStorage.setItem("users", JSON.stringify(localUsers));
      allUsers.unshift(newUser);

      showPage(allUsers.slice(0, 10));
      renderPagination();

      clearInputs();
    }

    function clearInputs() {
      ["userId", "name", "email", "gender", "status", "photo"].forEach((id) => {
        const el = document.getElementById(id);
        if (el.type === "file") el.value = null;
        else el.value = "";
      });

      setTimeout(() => {
        page = 1;
        showPage(allUsers.slice(0, 10));
        renderPagination();
      }, 500);
      document.getElementById("email").style.borderColor = "";
      document.getElementById("email").style.border = "";
    }
  });

  ["userId", "name", "gender", "status"].forEach((fieldId) => {
    const el = document.getElementById(fieldId);
    el.addEventListener("input", () => {
      showPage(allUsers.slice((page - 1) * perPage, page * perPage));
    });
  });

  const emailInput = document.getElementById("email");

  // пока печатаешь — не подсвечиваем
  emailInput.addEventListener("input", () => {
    showPage(allUsers.slice((page - 1) * perPage, page * perPage), false); // передаём флаг
  });

  // когда покинула поле (значит закончила писать)
  emailInput.addEventListener("blur", () => {
    showPage(allUsers.slice((page - 1) * perPage, page * perPage), true); // теперь можно проверять email
  });
});
