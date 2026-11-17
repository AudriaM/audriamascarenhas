const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('#projetos .project');
const emptyState = document.getElementById('projects-empty');

function applyProjectFilter(selectedButton) {
  const category = selectedButton.dataset.filter;
  let visibleCount = 0;

  filters.forEach(button => {
    const selected = button === selectedButton;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });

  projects.forEach(project => {
    // Cards de exemplo permanecem reservados até a publicação do projeto.
    const published = project.dataset.published !== 'false';
    const matches = category === 'todos'
      ? project.dataset.featured === 'true'
      : project.dataset.category === category;
    const visible = published && matches;
    project.classList.toggle('hidden', !visible);
    if (visible) visibleCount += 1;
  });

  if (emptyState) emptyState.hidden = visibleCount > 0;
}

filters.forEach(button => {
  button.addEventListener('click', () => applyProjectFilter(button));
});

const initialFilter = document.querySelector('.filter[aria-pressed="true"]') || filters[0];
if (initialFilter) applyProjectFilter(initialFilter);