// code.ts
figma.showUI(__html__, { width: 600, height: 600 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'get-image') {
    const selection = figma.currentPage.selection;

    if (selection.length === 0) {
      figma.ui.postMessage({ type: 'error', message: 'Please select a node!' });
      return;
    }

    const node = selection[0];

    try {
      const bytes = await node.exportAsync({ format: 'PNG' });
      figma.ui.postMessage({ type: 'image-bytes', data: Array.from(bytes) });
    } catch (error) {
      figma.ui.postMessage({
        type: 'error',
        message: 'Selected element cannot be exported as an image.',
      });
    }
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};
