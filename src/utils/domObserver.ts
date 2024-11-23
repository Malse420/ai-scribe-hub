import { debounce } from 'lodash';

export interface DOMChangeEvent {
  target: Element;
  type: 'childList' | 'attributes' | 'characterData';
  addedNodes?: NodeList;
  removedNodes?: NodeList;
  timestamp: number;
}

export class DOMObserver {
  private observer: MutationObserver;
  private observerConfig: MutationObserverInit;
  private changeCallback: (event: DOMChangeEvent) => void;
  
  constructor(callback: (event: DOMChangeEvent) => void, config?: Partial<MutationObserverInit>) {
    this.changeCallback = callback;
    this.observerConfig = {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
      ...config
    };

    // Debounce the callback to prevent excessive updates
    const debouncedCallback = debounce(this.handleMutation.bind(this), 250);
    
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => debouncedCallback(mutation));
    });
  }

  private handleMutation(mutation: MutationRecord) {
    const event: DOMChangeEvent = {
      target: mutation.target as Element,
      type: mutation.type as DOMChangeEvent['type'],
      timestamp: Date.now()
    };

    if (mutation.type === 'childList') {
      event.addedNodes = mutation.addedNodes;
      event.removedNodes = mutation.removedNodes;
    }

    this.changeCallback(event);
  }

  public observe(target: Element | null = document.body) {
    if (!target) {
      console.warn('No target element provided for observation');
      return;
    }
    this.observer.observe(target, this.observerConfig);
  }

  public disconnect() {
    this.observer.disconnect();
  }
}