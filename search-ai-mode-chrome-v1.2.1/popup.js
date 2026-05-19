document.addEventListener('DOMContentLoaded', async () => {
  const toggle = document.getElementById('toggle');
  const statusText = document.getElementById('statusText');

  const { enabled } = await chrome.runtime.sendMessage({ type: 'getStatus' });
  toggle.checked = enabled;
  updateUI(enabled);

  toggle.addEventListener('change', async () => {
    const enabled = toggle.checked;
    toggle.disabled = true;
    await chrome.runtime.sendMessage({ type: 'setEnabled', enabled });
    updateUI(enabled);
    toggle.disabled = false;
  });

  function updateUI(enabled) {
    if (enabled) {
      statusText.textContent = 'Active — AI Mode on every search';
      statusText.classList.add('active');
    } else {
      statusText.textContent = 'Inactive — standard search results';
      statusText.classList.remove('active');
    }
  }
});
