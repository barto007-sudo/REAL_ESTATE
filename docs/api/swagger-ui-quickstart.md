# OpenAPI Quickstart (Swagger UI)

## Contract File
- docs/api/openapi.yaml

## Option A: Swagger Editor (Fastest)
1. Open https://editor.swagger.io/
2. Replace existing content with docs/api/openapi.yaml content.
3. Review paths, schemas, and examples.
4. Export rendered docs if needed.

## Option B: Local Swagger UI with Docker
1. Ensure Docker is installed.
2. Run:
   docker run -p 8080:8080 -e SWAGGER_JSON=/foo/openapi.yaml -v ${PWD}/docs/api:/foo swaggerapi/swagger-ui
3. Open http://localhost:8080

## Option C: Integrate in Backend Service
- Add Swagger UI middleware in backend and serve docs from /api/docs.
- Load docs/api/openapi.yaml at startup.

## Review Checklist
- Auth endpoints and token flow are clear.
- RBAC-sensitive endpoints are identified.
- Request/response schemas match frontend expectations.
- ErrorResponse is consistent across modules.
- Pagination contract is uniform.

## Governance
- Any API change must update docs/api/openapi.yaml in the same pull request.
- PR reviewer must check OpenAPI diff and backward compatibility impact.
