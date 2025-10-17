// web/components/Table/table.js
export class SpTable {
  constructor() {
    this.template = document.getElementById('sp-table-template');
    this.el = null;
    this.data = [];
    this.columns = [];
    this.listeners = {};
    this.currentPage = 1;
    this.pageSize = 10;
  }

  mount(container, props = {}) {
    if (!this.template) {
      console.error('Template sp-table-template no encontrado');
      return;
    }

    const node = this.template.content.cloneNode(true);
    container.innerHTML = '';
    container.appendChild(node);

    this.el = container.querySelector('.sp-table-wrapper');
    this.headEl = this.el.querySelector('.sp-table-head');
    this.bodyEl = this.el.querySelector('.sp-table-body');
    this.countEl = this.el.querySelector('.sp-table-count');
    this.pageInfo = this.el.querySelector('.sp-page-info');
    this.searchEl = this.el.querySelector('.sp-table-search');

    if (props.columns) this.setColumns(props.columns);
    if (props.data) this.setData(props.data);

    // paginación
    this.el.querySelector('.sp-page-prev').addEventListener('click', () => this.prevPage());
    this.el.querySelector('.sp-page-next').addEventListener('click', () => this.nextPage());

    // búsqueda
    this.searchEl.addEventListener('input', e => this.filter(e.target.value));
  }

  setColumns(columns) {
    this.columns = columns;
    this.headEl.innerHTML = '';
    columns.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col.label;
      this.headEl.appendChild(th);
    });

    const thActions = document.createElement('th');
    thActions.textContent = 'Acciones';
    this.headEl.appendChild(thActions);
  }

  setData(data) {
    this.data = data;
    this.currentPage = 1;
    this.renderPage();
  }

  renderPage() {
    this.bodyEl.innerHTML = '';
    const start = (this.currentPage - 1) * this.pageSize;
    const pageData = this.data.slice(start, start + this.pageSize);

    if (pageData.length === 0) {
      this.bodyEl.innerHTML = `<tr><td colspan="${this.columns.length + 1}" class="sp-table-empty">No hay registros</td></tr>`;
    } else {
      pageData.forEach(row => {
        const tr = document.createElement('tr');
        this.columns.forEach(col => {
          const td = document.createElement('td');
          td.textContent = row[col.key] ?? '';
          tr.appendChild(td);
        });

        // columna acciones
        const tdActions = document.createElement('td');
        tdActions.innerHTML = `
          <button class="sp-action-btn" data-action="edit">Editar</button> |
          <button class="sp-action-btn" data-action="delete">Eliminar</button>
        `;
        tdActions.querySelectorAll('button').forEach(btn => {
          btn.addEventListener('click', e => {
            const action = e.target.dataset.action;
            this.emit(action, row);
          });
        });

        this.bodyEl.appendChild(tr);
      });
    }

    // contador
    this.countEl.textContent = `Mostrando ${this.data.length} registros`;
    const totalPages = Math.ceil(this.data.length / this.pageSize) || 1;
    this.pageInfo.textContent = `${this.currentPage} / ${totalPages}`;
  }

  nextPage() {
    const totalPages = Math.ceil(this.data.length / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.renderPage();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderPage();
    }
  }

  filter(query) {
    const filtered = this.data.filter(row =>
      Object.values(row).some(v => String(v).toLowerCase().includes(query.toLowerCase()))
    );
    this.currentPage = 1;
    this.bodyEl.innerHTML = '';
    if (filtered.length === 0) {
      this.bodyEl.innerHTML = `<tr><td colspan="${this.columns.length + 1}" class="sp-table-empty">Sin coincidencias</td></tr>`;
    } else {
      filtered.forEach(row => {
        const tr = document.createElement('tr');
        this.columns.forEach(col => {
          const td = document.createElement('td');
          td.textContent = row[col.key] ?? '';
          tr.appendChild(td);
        });
        const tdActions = document.createElement('td');
        tdActions.innerHTML = `
          <button class="sp-action-btn" data-action="edit">Editar</button> |
          <button class="sp-action-btn" data-action="delete">Eliminar</button>
        `;
        tdActions.querySelectorAll('button').forEach(btn => {
          btn.addEventListener('click', e => {
            const action = e.target.dataset.action;
            this.emit(action, row);
          });
        });
        this.bodyEl.appendChild(tr);
      });
    }
  }

  on(event, fn) {
    this.listeners[event] = fn;
  }

  emit(event, detail = null) {
    if (this.listeners[event]) this.listeners[event](detail);
    const evt = new CustomEvent(`sp:table:${event}`, { detail });
    this.el?.dispatchEvent(evt);
  }

  destroy() {
    if (this.el) this.el.remove();
    this.listeners = {};
  }
}
