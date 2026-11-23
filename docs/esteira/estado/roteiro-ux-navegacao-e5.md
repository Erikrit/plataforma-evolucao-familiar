# Homologação da navegação familiar — COR-E5-UX-HOM-20261122

Protótipo aprovado: `prototipo-cor-e5-ux-hom-20261122.html`.  
Implementação técnica local pronta. **Resultado humano desta rodada: AGUARDANDO.**

Para cada cenário, registrar perfil fictício, dispositivo (preferir 375px e 1280px), resultado observado e aprovado ou reprovado.

| Cenário | Critério para aprovação |
|---|---|
| Administrador no desktop (1280) | Início abre a família. Menu com ícones: Cuidados e Desenvolvimento expansíveis, Histórico, Resumo, Configurações (Meu perfil + Gestão). Estado ativo claro. Alternar entre duas pessoas muda os links. |
| Responsável no celular (375) | Menu Drawer: mesmos grupos. Cadastros só se autorizado. Cartões da home abrem a área escolhida. |
| Integrante e pessoa acompanhada | Meu perfil identifica a conta. Destinos e dados respeitam concessões. |
| Sessão e endereços | URL antiga `/biblioteca/jogos/{jogoId}` chega ao **catálogo**. Revogar acesso e reabrir a URL recusa. Trocar família na URL impede acesso. |
| Jogos — catálogo final | Filtros Todas / Concluídas / Não concluídas. Em cada cartão: progresso, seletor de fase e **Jogar**. Sem tela intermediária de fases. |
| Jogos — partida | Jogar abre o tabuleiro de imediato. **Como jogar** abre/fecha ajuda (objetivo + instruções). Dica e saída acessíveis. Concluir e reencontrar em Concluídas. |
| Evolução | Repetir a fase mantém uma descoberta em Histórico e Resumo. Somente participação presencial concede estrelas. |

## Evidência técnica (não substitui aceite humano)

Typecheck web, check-e4, check-e5, smoke-e5 (30), smoke-e4 (16), smoke-authz e build web (`PEF_NEXT_DIST_DIR=.next-qg-cor-e5`) passaram. Verifier: PASS_COM_ACHADOS com correção do objetivo apenas em Como jogar. Fingerprint: `sha256:307f5dcfcce6045b…`. Detalhes em `evidencia-cor-e5-ux-hom-20261122.json`.

## Observações para a rodada humana

Anotações extras (barra verde de progresso; unificar dica com Como jogar) ficaram **fora** do protótipo HTML aprovado e foram registradas na evidência — decidir se entram nesta homologação ou em demanda seguinte.
