const statusText = document.getElementById('status-text');
const itemCount = document.getElementById('item-count');
const inventoryTableBody = document.querySelector('#inventory-table tbody');
const addItemForm = document.getElementById('add-item-form');
const addItemButton = document.getElementById('add-item-button');
const addItemModal = document.getElementById('add-item-modal');
const closeModalButton = document.getElementById('close-modal');
const cancelButton = document.getElementById('cancel-button');

function openModal() {
  addItemModal.classList.add('open');
}

function closeModal() {
  addItemModal.classList.remove('open');
  addItemForm.reset();
}

addItemButton.addEventListener('click', openModal);
closeModalButton.addEventListener('click', closeModal);
cancelButton.addEventListener('click', closeModal);

addItemModal.addEventListener('click', (e) => {
  if (e.target === addItemModal) {
    closeModal();
  }
});


async function renderInventory() {
  statusText.textContent = 'Fetching inventory...';
  itemCount.textContent = 'Loading...';

  try {
    const response = await fetch('/inventory');
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const inventory = await response.json();
    itemCount.textContent = `${inventory.length} items`;
    statusText.textContent = 'Inventory loaded successfully.';

    if (!inventory.length) {
      inventoryTableBody.innerHTML = '<tr><td colspan="7" class="empty">No inventory items found.</td></tr>';
      return;
    }

    inventoryTableBody.innerHTML = inventory
      .map(item => {
        return `
          <tr>
            <td>${item.id}</td>
            <td>${item.item_name}</td>
            <td>${item.sport}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.supplier ?? '-'}</td>
            <td>
              <button class="delete-button" data-id="${item.id}">Delete</button>
            </td>
          </tr>
        `;
      })
      .join('');

    attachDeleteHandlers();
  } catch (error) {
    console.error(error);
    statusText.textContent = 'Unable to load inventory.';
    itemCount.textContent = 'Error';
    inventoryTableBody.innerHTML = `<tr><td colspan="7" class="empty">${error.message}</td></tr>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderInventory();
  addItemForm.addEventListener('submit', handleFormSubmit);
});

async function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(addItemForm);
  const itemData = {
    item_name: formData.get('item_name'),
    sport: formData.get('sport'),
    quantity: parseInt(formData.get('quantity')),
    price: parseFloat(formData.get('price')),
    supplier: formData.get('supplier') || null,
  };

  const submitButton = addItemForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Adding...';

  try {
    const response = await fetch('/inventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      throw new Error(`Failed to add item: ${response.status}`);
    }

    closeModal();
    statusText.textContent = 'Item added successfully!';
    renderInventory();
  } catch (error) {
    console.error(error);
    statusText.textContent = 'Unable to add item.';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Add Item';
  }
}


function attachDeleteHandlers() {
  const deleteButtons = document.querySelectorAll('.delete-button');
  deleteButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.dataset.id;
      if (!id) return;

      const confirmed = window.confirm('Delete this inventory item?');
      if (!confirmed) return;

      button.disabled = true;
      button.textContent = 'Deleting...';

      try {
        const response = await fetch(`/inventory/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`Delete failed: ${response.status}`);
        }

        renderInventory();
      } catch (error) {
        console.error(error);
        button.disabled = false;
        button.textContent = 'Delete';
        statusText.textContent = 'Unable to delete item.';
      }
    });
  });
}
