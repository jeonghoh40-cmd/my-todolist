# Clean Architecture Backend

This backend follows Clean Architecture principles as described by Robert C. Martin (Uncle Bob).

## Architecture Layers

### 1. Entities (src/entities/)
- Contains business objects with business rules
- Independent of frameworks and databases
- Represent core business concepts (User, Todo)

### 2. Use Cases (src/usecases/)
- Contain application-specific business rules
- Orchestrate data flow between entities and interfaces
- Implement business logic without knowing about external frameworks

### 3. Interfaces (src/interfaces/)
- Define contracts for data access and external services
- Use abstract interfaces to define what the system needs
- Implemented in the frameworks-and-drivers layer

### 4. Interface Adapters (src/interface-adapters/)
- Convert data between use case and external frameworks
- Controllers, presenters, gateways
- Implement input/output ports defined in use cases

### 5. Frameworks and Drivers (src/frameworks-and-drivers/)
- External implementations of interfaces
- Database implementations, external API clients
- Framework-specific code (Express, PostgreSQL, etc.)

## Dependency Rule

Dependencies point inward toward higher-level policies. Inner layers (Entities, Use Cases) know nothing about outer layers (Frameworks and Drivers).

## Key Benefits

1. **Independence of Frameworks**: The core business logic doesn't depend on external frameworks
2. **Independence of UI**: The business rules don't know anything about the UI
3. **Independence of Database**: Business rules don't depend on the database
4. **Independence of External Agencies**: Business rules don't depend on external agencies
5. **Testable**: Business rules can be tested without UI, database, web server, or any external element

## Migration Notes

During the migration from the old architecture to Clean Architecture:
- Old files are marked as deprecated but maintained for backward compatibility
- New Clean Architecture implementations are in the appropriate folders
- Controllers now use the new architecture through the service layer
- The composition root wires up all dependencies