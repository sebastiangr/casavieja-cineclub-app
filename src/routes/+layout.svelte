<script>
  let { children,  title = "My App!!!" } = $props();
</script>

<main>
  <header>
    <h1>{title}</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>
  </header>

  {@render children()}

  <footer>
    <p>&copy; {new Date().getFullYear()} My App. All rights reserved.</p>
  </footer>

</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }

  header {
    background-color: #f8f9fa;
    padding: 1rem;
    border-bottom: 1px solid #e9ecef;
  }

  nav a {
    margin-right: 1rem;
    text-decoration: none;
    color: #007bff;
  }

  footer {
    text-align: center;
    padding: 1rem;
    border-top: 1px solid #e9ecef;
    margin-top: 2rem;
  }
</style>

