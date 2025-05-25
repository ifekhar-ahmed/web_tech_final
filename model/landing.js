 function toggleTheme() {
      document.body.classList.toggle('dark-theme');
      // Change icon accordingly
      const btn = document.querySelector('.theme-toggle i');
      if (document.body.classList.contains('dark-theme')) {
        btn.classList.remove('fa-moon');
        btn.classList.add('fa-sun');
      } else {
        btn.classList.remove('fa-sun');
        btn.classList.add('fa-moon');
      }
    }