import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertaBanner } from "./AlertaBanner";

interface ErrorBoundaryProps {
  children: ReactNode;
  mensagem?: string;
}

interface ErrorBoundaryState {
  ocorreuErro: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    ocorreuErro: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { ocorreuErro: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Erro capturado pelo ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.ocorreuErro) {
      return (
        <AlertaBanner
          tipo="error"
          titulo="Algo deu errado"
          mensaje={
            this.props.mensagem ??
            "Não foi possível exibir esta seção. Tente novamente."
          }
        />
      );
    }

    return this.props.children;
  }
}
